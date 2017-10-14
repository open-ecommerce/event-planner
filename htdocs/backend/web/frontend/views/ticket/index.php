<?php

use yii\helpers\Html;
use yii\grid\GridView;

/* @var $this yii\web\View */
/* @var $searchModel frontend\models\search\TicketSearch */
/* @var $dataProvider yii\data\ActiveDataProvider */

$this->title = Yii::t('common', 'Tickets');
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="ticket-index">

    <?php // echo $this->render('_search', ['model' => $searchModel]); ?>

    <p>
        <?php echo Html::a(Yii::t('common', 'Create {modelClass}', [
    'modelClass' => 'Ticket',
]), ['create'], ['class' => 'btn btn-success']) ?>
    </p>

    <?php echo GridView::widget([
        'dataProvider' => $dataProvider,
        'filterModel' => $searchModel,
        'columns' => [
            ['class' => 'yii\grid\SerialColumn'],

            'id',
            'barcode',
            'transaction_id',
            'attendee_id',
            'registration_id',
            // 'registration_time',
            // 'registration_code',
            // 'registration_status',
            // 'transaction_status',
            // 'transaction_amount',
            // 'amount_paid',
            // 'payment_date',
            // 'payment_method',
            // 'geteway_transaction',
            // 'ticket_name',
            // 'ticket_date',
            // 'first_name',
            // 'last_name',
            // 'email:email',
            // 'address_1',
            // 'address_2',
            // 'city',
            // 'state',
            // 'country',
            // 'postal_code',
            // 'phone',
            // 'notes:ntext',
            // 'dance_partner',
            // 'dance_partner_nationality',

            ['class' => 'yii\grid\ActionColumn'],
        ],
    ]); ?>

</div>
