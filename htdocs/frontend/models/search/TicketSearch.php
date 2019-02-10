<?php

namespace frontend\models\search;

use Yii;
use yii\base\Model;
use yii\data\ActiveDataProvider;
use common\models\Ticket;

/**
 * TicketSearch represents the model behind the search form about `common\models\Ticket`.
 */
class TicketSearch extends Ticket {

    public $barcodeSearch;
    public $fullName;

    /**
     * @inheritdoc
     */
    public function rules() {
        return [
            [['id', 'transaction_id', 'attendee_id', 'registration_id', 'ticket_type_id'], 'integer'],
            [['ticket_status','barcodeSearch', 'barcode', 'registration_time', 'registration_code', 'registration_status', 'transaction_status', 'payment_date', 'payment_method', 'geteway_transaction', 'ticket_name', 'ticket_date', 'first_name', 'last_name', 'email', 'address_1', 'address_2', 'city', 'state', 'country', 'postal_code', 'phone', 'notes'], 'safe'],
            [['transaction_amount', 'amount_paid'], 'number'],
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
     *
     * @param array $params
     *
     * @return ActiveDataProvider
     */
    public function search($params) {
        $query = Ticket::find();

        $dataProvider = new ActiveDataProvider([
            'query' => $query,
        ]);

        if (!($this->load($params) && $this->validate())) {
            return $dataProvider;
        }

        if (!empty($this->barcodeSearch)) {
            $query->andFilterWhere(['like', 'barcode', $this->barcodeSearch]);
        } else {

            $query->andFilterWhere([
                'id' => $this->id,
                'ticket_type_id' => $this->ticket_type_id,
            ]);

            $query->andFilterWhere(['like', 'registration_code', $this->registration_code])
                    ->andFilterWhere(['like', 'registration_status', $this->registration_status])
                    ->andFilterWhere(['like', 'transaction_status', $this->transaction_status])
                    ->andFilterWhere(['like', 'payment_method', $this->payment_method])
                    ->andFilterWhere(['like', 'geteway_transaction', $this->geteway_transaction])
                    ->andFilterWhere(['like', 'first_name', $this->first_name])
                    ->andFilterWhere(['=', 'ticket_status', $this->ticket_status])
                    ->andFilterWhere(['like', 'last_name', $this->last_name])
                    ->andFilterWhere(['like', 'email', $this->email])
                    ->andFilterWhere(['like', 'address_1', $this->address_1])
                    ->andFilterWhere(['like', 'address_2', $this->address_2])
                    ->andFilterWhere(['like', 'city', $this->city])
                    ->andFilterWhere(['like', 'state', $this->state])
                    ->andFilterWhere(['like', 'country', $this->country])
                    ->andFilterWhere(['like', 'postal_code', $this->postal_code])
                    ->andFilterWhere(['like', 'phone', $this->phone])
                    ->andFilterWhere(['like', 'notes', $this->notes]);
        }
        return $dataProvider;
    }

}
