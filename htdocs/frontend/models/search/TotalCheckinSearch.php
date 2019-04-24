<?php

namespace frontend\models\search;

use Yii;
use yii\base\Model;
use yii\data\ActiveDataProvider;
use common\models\TotalCheckin;

/**
 * StatisticsSearch represents the model behind the search form about `app\models\Attendance`.
 */
class TotalCheckinSearch extends TotalCheckin
{
    /**
     * @inheritdoc
     */

    public $Clients;

    public function rules()
    {
        return [
          [['name', 'total', 'role'], 'safe'],
        ];
    }

    /**
     * @inheritdoc
     */
    public function scenarios()
    {
        // bypass scenarios() implementation in the parent class
        return Model::scenarios();
    }

    /**
     * Creates data provider instance with search query applied
     *
     * @param array $params
     *
     * @return ActiveDataProvider
     */
    public function search($params)
    {

        $query = TotalCheckin::findCheckinToday();
        $query->all();


        $dataProvider = new ActiveDataProvider([
            'query' => $query,
        ]);

        $this->load($params);

        if (!$this->validate()) {
            return $dataProvider;
        }


        return $dataProvider;
    }







}
