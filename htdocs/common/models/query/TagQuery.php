<?php
/**
 * Created by PhpStorm.
 * User: zein
 * Date: 7/4/14
 * Time: 2:31 PM
 */

namespace common\models\query;

use common\models\Tag;
use yii\db\ActiveQuery;
use yii\data\ActiveDataProvider;



class TagQuery extends Tag
{
    public function rules()
    {
        return [
            [['id', 'frequency'], 'integer'],
            [['name'], 'safe'],
        ];
    }

    public function scenarios()
    {
        // bypass scenarios() implementation in the parent class
        return Model::scenarios();
    }

    public function search($params)
    {
        $query = Tag::find();

        $dataProvider = new ActiveDataProvider([
            'query' => $query,
        ]);

        if (!($this->load($params) && $this->validate())) {
            return $dataProvider;
        }

        $query->andFilterWhere([
            'id' => $this->id,
            'frequency' => $this->frequency,
        ])
            ->andFilterWhere(['like', 'name', $this->name]);

        return $dataProvider;
    }
}
