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
    <?php echo DetailView::widget([
        'model' => $model,
        'attributes' => [
            'id',
            'transaction_id',
            'attendee_id',
            'registration_id',
            'registration_status',
            'transaction_status',
            'transaction_amount',
            'amount_paid',
            'ticket_name',
            'ticket_date',
            'first_name',
            'last_name',
            'email:email',
            'notes:ntext',
        ],
    ]) ?>

</div>
