<?php

namespace common\models;

use common\commands\AddToTimelineCommand;
use common\models\query\UserQuery;
use common\models\UserProfile;
use Yii;
use yii\behaviors\AttributeBehavior;
use yii\behaviors\TimestampBehavior;
use yii\db\ActiveRecord;
use yii\helpers\ArrayHelper;
use yii\web\IdentityInterface;
use yii\db\Query;

/**
 * User model
 *
 * @property integer $id
 * @property string $username
 * @property string $password_hash
 * @property string $email
 * @property string $auth_key
 * @property string $access_token
 * @property string $oauth_client
 * @property string $oauth_client_user_id
 * @property string $publicIdentity
 * @property integer $status
 * @property integer $created_at
 * @property integer $updated_at
 * @property integer $logged_at
 * @property string $password write-only password
 *
 * @property \common\models\UserProfile $userProfile
 */
class User extends ActiveRecord implements IdentityInterface {

    const STATUS_NOT_ACTIVE = 1;
    const STATUS_ACTIVE = 2;
    const STATUS_DELETED = 3;
    const ROLE_USER = 'user';
    const ROLE_READER = 'reader';
    const ROLE_MANAGER = 'manager';
    const ROLE_ADMINISTRATOR = 'administrator';
    const EVENT_AFTER_SIGNUP = 'afterSignup';
    const EVENT_AFTER_LOGIN = 'afterLogin';

    /**
     * @inheritdoc
     */
    public static function tableName() {
        return '{{%user}}';
    }

    /**
     * @return UserQuery
     */
    public static function find() {
        return new UserQuery(get_called_class());
    }

    /**
     * @inheritdoc
     */
    public function behaviors() {
        return [
            TimestampBehavior::className(),
            'auth_key' => [
                'class' => AttributeBehavior::className(),
                'attributes' => [
                    ActiveRecord::EVENT_BEFORE_INSERT => 'auth_key'
                ],
                'value' => Yii::$app->getSecurity()->generateRandomString()
            ],
            'access_token' => [
                'class' => AttributeBehavior::className(),
                'attributes' => [
                    ActiveRecord::EVENT_BEFORE_INSERT => 'access_token'
                ],
                'value' => function () {
                    return Yii::$app->getSecurity()->generateRandomString(40);
                }
            ]
        ];
    }

    /**
     * @return array
     */
    public function scenarios() {
        return ArrayHelper::merge(
                        parent::scenarios(), [
                    'oauth_create' => [
                        'oauth_client', 'oauth_client_user_id', 'email', 'username', '!status'
                    ]
                        ]
        );
    }

    /**
     * @inheritdoc
     */
    public function rules() {
        return [
            [['username', 'email'], 'unique'],
            ['status', 'default', 'value' => self::STATUS_NOT_ACTIVE],
            ['status', 'in', 'range' => array_keys(self::statuses())],
            [['username'], 'filter', 'filter' => '\yii\helpers\Html::encode'],
            [['publicIdentity', 'company'], 'safe']
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels() {
        return [
            'username' => Yii::t('common', 'Username'),
            'email' => Yii::t('common', 'E-mail'),
            'status' => Yii::t('common', 'Status'),
            'access_token' => Yii::t('common', 'API access token'),
            'created_at' => Yii::t('common', 'Created at'),
            'updated_at' => Yii::t('common', 'Updated at'),
            'logged_at' => Yii::t('common', 'Last login'),
            'publicIdentity' => Yii::t('common', 'Full Name'),
            'company' => Yii::t('common', 'Company'),
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getUserProfile() {
        return $this->hasOne(UserProfile::className(), ['user_id' => 'id']);
    }

    /**
     * @inheritdoc
     */
    public static function findIdentity($id) {
        return static::find()
                        ->active()
                        ->andWhere(['id' => $id])
                        ->one();
    }

    /**
     * @inheritdoc
     */
    public static function findIdentityByAccessToken($token, $type = null) {
        return static::find()
                        ->active()
                        ->andWhere(['access_token' => $token, 'status' => self::STATUS_ACTIVE])
                        ->one();
    }

    /**
     * Finds user by username
     *
     * @param string $username
     * @return static|null
     */
    public static function findByUsername($username) {
        return static::find()
                        ->active()
                        ->andWhere(['username' => $username, 'status' => self::STATUS_ACTIVE])
                        ->one();
    }

    /**
     * Finds user by username or email
     *
     * @param string $login
     * @return static|null
     */
    public static function findByLogin($login) {
        return static::find()
                        ->active()
                        ->andWhere(['or', ['username' => $login], ['email' => $login]])
                        ->one();
    }

    /**
     * @inheritdoc
     */
    public function getId() {
        return $this->getPrimaryKey();
    }

    /**
     * @inheritdoc
     */
    public function getAuthKey() {
        return $this->auth_key;
    }

    /**
     * @inheritdoc
     */
    public function validateAuthKey($authKey) {
        return $this->getAuthKey() === $authKey;
    }

    /**
     * Validates password
     *
     * @param string $password password to validate
     * @return boolean if password provided is valid for current user
     */
    public function validatePassword($password) {
        return Yii::$app->getSecurity()->validatePassword($password, $this->password_hash);
    }

    /**
     * Generates password hash from password and sets it to the model
     *
     * @param string $password
     */
    public function setPassword($password) {
        $this->password_hash = Yii::$app->getSecurity()->generatePasswordHash($password);
    }

    /**
     * Returns user statuses list
     * @return array|mixed
     */
    public static function statuses() {
        return [
            self::STATUS_NOT_ACTIVE => Yii::t('common', 'Not Active'),
            self::STATUS_ACTIVE => Yii::t('common', 'Active'),
            self::STATUS_DELETED => Yii::t('common', 'Deleted')
        ];
    }

    /**
     * Creates user profile and application event
     * @param array $profileData
     */
    public function afterSignup(array $profileData = []) {
        $this->refresh();
        Yii::$app->commandBus->handle(new AddToTimelineCommand([
            'category' => 'user',
            'event' => 'signup',
            'data' => [
                'public_identity' => $this->getPublicIdentity(),
                'user_id' => $this->getId(),
                'created_at' => $this->created_at
            ]
        ]));
        $profile = new UserProfile();
        $profile->load($profileData, '');
        $this->link('userProfile', $profile);
        $this->trigger(self::EVENT_AFTER_SIGNUP);
        // Default role
        $auth = Yii::$app->authManager;
        $auth->assign($auth->getRole(User::ROLE_USER), $this->getId());
    }

    /**
     * @return string
     */
    public function getPublicIdentity() {
        if ($this->userProfile && $this->userProfile->getFullname()) {
            return $this->userProfile->getFullname();
        }
        if ($this->username) {
            return $this->username;
        }
        return $this->email;
    }

    public function getFirstname() {
        return $this->userProfile->firstname;
    }

    public function getAvatar($default = null) {
        return $this->userProfile->getAvatar();
    }

    public function getPicture($default = null) {
        return $this->userProfile->getPicture();
    }

    public function getUsername() {
        return $this->userProfile->getFullName();
    }

    public function getCompany() {
        return $this->userProfile->getCompany();
    }

    public function getCompanyCountryName() {
        return $this->userProfile->getCompanyCountryName();
    }

    public function getCompanyCountryId() {
        return $this->userProfile->getCompanyCountryId();
    }

    /**
     * Finds all users by assignment role
     *
     * @param  \yii\rbac\Role $role
     * @return static|null
     */
    public function getScouts($roles = 'adminstrator') {
        $scouts = (new Query())
                ->select(['user_profile.user_id', "CONCAT(firstname, ' ', lastname) AS fullname"])
                ->from('rbac_auth_assignment')
                ->join('INNER JOIN', 'user_profile', 'rbac_auth_assignment.user_id = user_profile.user_id')
                ->where(['item_name' => ['administrator', 'reader']])
                ->andWhere(['not', ['user_profile.firstname' => null]])
                ->orderBy('user_profile.firstname')
                ->all();

        $items = [];
        foreach ($scouts as $scout) {
            $items[] = ['id' => $scout['user_id'], 'fullname' => $scout['fullname']];
        }
        return $items;
    }

    public function getUserRole() {
        $roles = \Yii::$app->authManager->getRolesByUser($this->id);

        $role = '';

        foreach ($roles as $key => $value) {
            $role = $key;
        }

        return $role;
    }

    /**
     * Finds all users by assignment role
     *
     * @param  \yii\rbac\Role $role
     * @return static|null
     */
    public function getNewsletterList($roles = 'adminstrator', $mode = 'testing') {
        if ($mode === 'production') {
            $usersList = (new Query())
                    ->select(['user.email', "CONCAT(firstname, ' ', lastname) AS fullname"])
                    ->from('user')
                    ->join('INNER JOIN', 'user_profile', 'user.id = user_profile.user_id')
//                ->where(['item_name' => ['administrator', 'reader']])
                    ->orderBy('user_profile.firstname')
                    ->all();

            $items = [];
            foreach ($usersList as $user) {
                $items[] = ['subscriber_email' => $user['email'], 'fullname' => $user['fullname']];
            }
            // return $items;
        } else {
            $items[] = ['subscriber_email' => 'tester1@open-ecommerce.org', 'fullname' => 'Primer Tester Edu'];
            $items[] = ['subscriber_email' => 'tester2@open-ecommerce.org', 'fullname' => 'Segundo Tester Edu'];
            $items[] = ['subscriber_email' => 'tester3@open-ecommerce.org', 'fullname' => 'Tercero Tester Edu'];
            $items[] = ['subscriber_email' => 'tester4@open-ecommerce.org', 'fullname' => 'Cuarto Tester Edu'];
            $items[] = ['subscriber_email' => 'tester5@open-ecommerce.org', 'fullname' => 'Quinto Tester Edu'];
            $items[] = ['subscriber_email' => 'testera@open-ecommerce.org', 'fullname' => 'Primer Tester Chorgo'];
            $items[] = ['subscriber_email' => 'testerb@open-ecommerce.org', 'fullname' => 'Segundo Tester Chorgo'];
            $items[] = ['subscriber_email' => 'testerc@open-ecommerce.org', 'fullname' => 'Tercero Tester Chorgo'];
            $items[] = ['subscriber_email' => 'testerd@open-ecommerce.org', 'fullname' => 'Cuarto Tester Chorgo'];
            $items[] = ['subscriber_email' => 'testere@open-ecommerce.org', 'fullname' => 'Quinto Tester Chorgo'];
            return $items;
        }
    }

}
