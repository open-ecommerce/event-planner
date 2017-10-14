<?php

namespace common\models;

use trntv\filekit\behaviors\UploadBehavior;
use Yii;
use yii\db\ActiveRecord;
use common\models\Venue;
use yii\helpers\ArrayHelper;

/**
 * This is the model class for table "user_profile".
 *
 * @property integer $user_id
 * @property integer $locale
 * @property string $firstname
 * @property string $lastname
 * @property string $picture
 * @property string $avatar
 * @property string $avatar_path
 * @property string $avatar_base_url
 *
 * @property User $user
 */
class UserProfile extends ActiveRecord {

    /**
     * @var
     */
    public $picture;
    /**
     * @return array
     */
    public function behaviors() {
        return [
            'picture' => [
                'class' => UploadBehavior::className(),
                'attribute' => 'picture',
                'pathAttribute' => 'avatar_path',
                'baseUrlAttribute' => 'avatar_base_url'
            ],
        ];
    }

    /**
     * @inheritdoc
     */
    public static function tableName() {
        return '{{%user_profile}}';
    }

    /**
     * @inheritdoc
     */
    public function rules() {
        return [
            [['user_id', 'firstname'], 'required'],
            [['user_id', 'venue_id'], 'integer'],
            [['firstname', 'lastname', 'avatar_path', 'avatar_base_url', 'job_title'], 'string', 'max' => 255],
            [['about'], 'string'],
            ['picture', 'safe'],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels() {
        return [
            'user_id' => Yii::t('common', 'User ID'),
            'firstname' => Yii::t('common', 'Firstname'),
            'lastname' => Yii::t('common', 'Lastname'),
            'venue' => Yii::t('common', 'Venue'),
            'about' => Yii::t('common', 'About me'),
            'job_title' => Yii::t('common', 'Job title'),
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getUser() {
        return $this->hasOne(User::className(), ['id' => 'user_id']);
    }

    /**
     * @return null|string
     */
    public function getFullName() {
        if ($this->firstname || $this->lastname) {
            return implode(' ', [$this->firstname, $this->lastname]);
        }
        return null;
    }

    /**
     * @param null $default
     * @return bool|null|string
     */
    public function getAvatar($default = null) {
        if ((empty($default)) && (empty($this->avatar_path))) {
            $default = "https://robohash.org/set_set1/" . $this->firstname . "?size=440x440";
        }

        return $this->avatar_path ? Yii::getAlias($this->avatar_base_url . '/' . $this->avatar_path) : $default;
    }
    
    public function getCountry() {
        return $this->hasOne(Country::className(), ['id' => 'country_id']);
    }

    public function getVenue() {
        return $this->hasOne(Venue::className(), ['id' => 'venue_id']);
        //return "peron";
    }
    
    
    public function getUserById($id) {
        $selectedUser = UserProfile::findOne(['user_id' => $id]);
        return $selectedUser->firstname . " " .$selectedUser->lastname;
    }
    

}
