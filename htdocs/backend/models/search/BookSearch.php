<?php

namespace backend\models\search;

use Yii;
use yii\base\Model;
use yii\data\ActiveDataProvider;
use common\models\Book;

/**
 * BookSearch represents the model behind the search form about `common\models\Book`.
 */
class BookSearch extends Book {

    public $reportName;
    public $link_frontend;

    /**
     * @inheritdoc
     */
    public function rules() {
        return [
            [['id', 'created_by', 'author_id', 'publisher_id', 'updated_by', 'status', 'report_by', 'hot', 'loved', 'essential', 'country_id', 'rights_owner_id'], 'integer'],
            [['title', 'body', 'updated_at', 'created_at'], 'safe'],
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
        $query = Book::find();


        $query->joinWith(['author', 'profile']);


        $dataProvider = new ActiveDataProvider([
            'query' => $query,
        ]);

        $dataProvider->setSort([
            'attributes' => [
                'id'
            ]
        ]);


        if (!($this->load($params) && $this->validate())) {
            return $dataProvider;
        }

        $query->andFilterWhere([
            'book.id' => $this->id,
            'slug' => $this->link_frontend,
            'report_by' => $this->report_by,
            'author_id' => $this->author_id,
            'rights_owner_id' => $this->rights_owner_id,
            'updated_by' => $this->updated_by,
            'book.status' => $this->status,
            'hot' => $this->hot,
            'essential' => $this->essential,
            'loved' => $this->loved,
            'publisher_id' => $this->publisher,
            'country_id' => $this->country_id,
        ]);

        $query->andFilterWhere(['like', 'title', $this->title]);
        if (!empty($this->updated_at)) {
            $date_explode = explode("-", $this->updated_at);
            $date1 = \DateTime::createFromFormat("d M Y H:i", trim($date_explode[0]) . ' 00:00');
            $date2 = \DateTime::createFromFormat("d M Y H:i", trim($date_explode[1]) . ' 24:59');
            $query->andFilterWhere(['between', 'updated_at', $date1->getTimestamp(), $date2->getTimestamp()]);
        }       
        if (!empty($this->created_at)) {
            $date_explode = explode("-", $this->created_at);
            $date1 = \DateTime::createFromFormat("d M Y H:i", trim($date_explode[0]) . ' 00:00');
            $date2 = \DateTime::createFromFormat("d M Y H:i", trim($date_explode[1]) . ' 24:59');
            $query->andFilterWhere(['between', 'created_at', $date1->getTimestamp(), $date2->getTimestamp()]);
        }

        return $dataProvider;
    }

}
