<?php

namespace frontend\models\search;

use Yii;
use yii\base\Model;
use yii\data\ActiveDataProvider;
use common\models\Book;
use common\models\Bookmark;
use common\models\Author;

/**
 * BookSearch represents the model behind the search form about `common\models\Book`.
 */
class BookmarkSearch extends Bookmark {

    public $reportName;

    /**
     * @inheritdoc
     */
    public function rules() {
        return [
            [['id', 'type'], 'integer'],
            [['title','url', 'author'], 'safe'],
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
        $query = Bookmark::find();
        $userId = Yii::$app->user->identity->id;
        $query->andWhere(['user_id' => $userId]);


        $dataProvider = new ActiveDataProvider([
            'query' => $query,
        ]);

        $dataProvider->setSort([
            'attributes' => [
                'url',
                'title',
                'type',
                'author'
            ]
        ]);


        if (!($this->load($params) && $this->validate())) {
            return $dataProvider;
        }

        $query->andFilterWhere([
            'id' => $this->id,
            'type' => $this->type,
        ]);

        $query->andFilterWhere(['like', 'title', $this->url]);
        $query->andFilterWhere(['like', 'author', $this->url]);



        return $dataProvider;
    }

}
