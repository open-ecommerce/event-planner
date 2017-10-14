<?php

namespace backend\models\search;

use Yii;
use yii\base\Model;
use yii\data\ActiveDataProvider;
use common\models\User;

/**
 * UserSearch represents the model behind the search form about `common\models\User`.
 */
class UserSearch extends User {

    public $userRole;
    public $publicIdentity;
    public $publishing_house_id;
    public $avatar;

    /**
     * @inheritdoc
     */
    public function rules() {
        return [
            [['id', 'status', 'created_at', 'updated_at', 'logged_at'], 'integer'],
            [['username', 'auth_key', 'password_hash', 'email', 'userRole', 'publicIdentity', 'publishing_house_id', 'avatar'], 'safe'],
        ];
    }

    /**
     * @inheritdoc
     */
    public function scenarios() {
        // bypass scenarios() implementation in the parent class
        return Model::scenarios();
    }

    /**
     * Creates data provider instance with search query applied
     * @return ActiveDataProvider
     */
    public function search($params) {
        $query = User::find();

        $dataProvider = new ActiveDataProvider([
            'query' => $query,
        ]);

        //if ($this->userRole) {
            $query->join('LEFT JOIN', 'rbac_auth_assignment', 'rbac_auth_assignment.user_id = id');
            //        ->andFilterWhere(['rbac_auth_assignment.item_name' => $this->userRole]);
        //}
            
        // add filter based in the user relation with profile
        $query->joinWith(['userProfile' => function ($q) {
                $q->where('user_profile.firstname  LIKE "%' . $this->publicIdentity . '%"' . ' OR user_profile.lastname LIKE "%' . $this->publicIdentity . '%"');
            }]);

        /**
         * Setup your sorting attributes
         * Note: This is setup before the $this->load($params) 
         * statement below
         */
        $dataProvider->setSort([
            'attributes' => [
                'id',
                'status',
                'publishing_house_id',
                'username',
                'email',
                'item_name',
                'publicIdentity' => [
                    'asc' => ['item_name' => SORT_ASC],
                    'desc' => ['item_name' => SORT_DESC],
                    'label' => 'Role',
                    'default' => SORT_ASC
                ], 
                'userRole' => [
                    'asc' => ['firstname' => SORT_ASC, 'lastname' => SORT_ASC],
                    'desc' => ['firstname' => SORT_DESC, 'lastname' => SORT_DESC],
                    'label' => 'Full Name',
                    'default' => SORT_ASC
                ],
                'created_at'
            ]
        ]);




        if (!($this->load($params) && $this->validate())) {
            return $dataProvider;
        }


        $query->andFilterWhere([
            'id' => $this->id,
            'status' => $this->status,
            'publishing_house_id' => $this->publishing_house_id,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'logged_at' => $this->logged_at
        ]);

        $query->andFilterWhere(['like', 'username', $this->username])
                ->andFilterWhere(['like', 'item_name', $this->userRole])
                ->andFilterWhere(['like', 'auth_key', $this->auth_key])
                ->andFilterWhere(['like', 'password_hash', $this->password_hash])
                ->andFilterWhere(['like', 'email', $this->email]);


        return $dataProvider;
    }

}
