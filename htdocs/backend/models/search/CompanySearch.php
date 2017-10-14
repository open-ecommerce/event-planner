<?php

namespace backend\models\search;

use Yii;
use yii\base\Model;
use yii\data\ActiveDataProvider;
use common\models\Company;

/**
 * BookSearch represents the model behind the search form about `common\models\Book`.
 */
class CompanySearch extends Company {

    public $reportName;

    /**
     * @inheritdoc
     */
    public function rules() {
        return [
            [['id','country_id', 'status'], 'integer'],
            [['name', 'notes', 'allowed_categories'], 'safe'],
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
        $query = Company::find();

        $query->joinWith(['country']);

        $dataProvider = new ActiveDataProvider([
            'query' => $query,
        ]);

        $dataProvider->setSort([
            'attributes' => [
                'id',
                'country_id',
                'name',
                'status'
            ]
        ]);




        if (!($this->load($params) && $this->validate())) {
            return $dataProvider;
        }

        $query->andFilterWhere([
            'id' => $this->id,
            'country_id' => $this->country_id,
            'status' => $this->status,
        ]);

        $query->andFilterWhere(['like', 'name', $this->name]);

        return $dataProvider;
    }

}
