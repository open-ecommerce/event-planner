<?php

namespace backend\models\search;

use Yii;
use yii\base\Model;
use yii\data\ActiveDataProvider;
use common\models\Contact;

/**
 * ContactSearch represents the model behind the search form about `common\models\Contact`.
 */
class ContactSearch extends Contact
{
    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['id', 'contact_type_id', 'parent_id', 'name', 'website', 'phone', 'email'], 'safe'],
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
     * @return ActiveDataProvider
     */
    public function search($params)
    {
        $query = Contact::find();
        
        $query->joinWith(['contactType']);        
        
        
        
        $dataProvider = new ActiveDataProvider([
            'query' => $query,
        ]);
        
        
        if (!($this->load($params) && $this->validate())) {
            return $dataProvider;
        }
        
        $query->andFilterWhere(['like', 'name', $this->name]);
        $query->andFilterWhere(['like', 'website', $this->website]);
        $query->andFilterWhere(['like', 'phone', $this->phone]);
        $query->andFilterWhere(['like', 'email', $this->email]);
        $query->andFilterWhere([
            'id' => $this->id,
            'contact_type_id' => $this->contact_type_id,
            'parent_id' => $this->parent_id
        ]);
        
        
        
        return $dataProvider;
    }

    
 
    
    
        }
