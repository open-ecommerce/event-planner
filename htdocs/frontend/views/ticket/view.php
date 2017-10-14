<?php

use yii\helpers\Html;
use yii\widgets\DetailView;

/* @var $this yii\web\View */
/* @var $model common\models\Ticket */

$this->title = $model->id;
$this->params['breadcrumbs'][] = ['label' => Yii::t('common', 'Tickets'), 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="ticket-view">

    <p>
        <?php echo Html::a(Yii::t('common', 'Update'), ['update', 'id' => $model->id], ['class' => 'btn btn-primary']) ?>
        <?php echo Html::a(Yii::t('common', 'Delete'), ['delete', 'id' => $model->id], [
            'class' => 'btn btn-danger',
            'data' => [
                'confirm' => Yii::t('common', 'Are you sure you want to delete this item?'),
                'method' => 'post',
            ],
        ]) ?>
    </p>

    <?php echo DetailView::widget([
        'model' => $model,
        'attributes' => [
            'id',
            'barcode',
            'transaction_id',
            'attendee_id',
            'registration_id',
            'registration_time',
            'registration_code',
            'registration_status',
            'transaction_status',
            'transaction_amount',
            'amount_paid',
            'payment_date',
            'payment_method',
            'geteway_transaction',
            'ticket_name',
            'ticket_date',
            'first_name',
            'last_name',
            'email:email',
            'address_1',
            'address_2',
            'city',
            'state',
            'country',
            'postal_code',
            'phone',
            'notes:ntext',
            'dance_partner',
            'dance_partner_nationality',
        ],
    ]) ?>

</div>
