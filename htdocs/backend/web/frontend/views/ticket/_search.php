<?php

use yii\helpers\Html;
use yii\bootstrap\ActiveForm;

/* @var $this yii\web\View */
/* @var $model frontend\models\search\TicketSearch */
/* @var $form yii\bootstrap\ActiveForm */
?>

<div class="ticket-search">

    <?php $form = ActiveForm::begin([
        'action' => ['index'],
        'method' => 'get',
    ]); ?>

    <?php echo $form->field($model, 'id') ?>

    <?php echo $form->field($model, 'barcode') ?>

    <?php echo $form->field($model, 'transaction_id') ?>

    <?php echo $form->field($model, 'attendee_id') ?>

    <?php echo $form->field($model, 'registration_id') ?>

    <?php // echo $form->field($model, 'registration_time') ?>

    <?php // echo $form->field($model, 'registration_code') ?>

    <?php // echo $form->field($model, 'registration_status') ?>

    <?php // echo $form->field($model, 'transaction_status') ?>

    <?php // echo $form->field($model, 'transaction_amount') ?>

    <?php // echo $form->field($model, 'amount_paid') ?>

    <?php // echo $form->field($model, 'payment_date') ?>

    <?php // echo $form->field($model, 'payment_method') ?>

    <?php // echo $form->field($model, 'geteway_transaction') ?>

    <?php // echo $form->field($model, 'ticket_name') ?>

    <?php // echo $form->field($model, 'ticket_date') ?>

    <?php // echo $form->field($model, 'first_name') ?>

    <?php // echo $form->field($model, 'last_name') ?>

    <?php // echo $form->field($model, 'email') ?>

    <?php // echo $form->field($model, 'address_1') ?>

    <?php // echo $form->field($model, 'address_2') ?>

    <?php // echo $form->field($model, 'city') ?>

    <?php // echo $form->field($model, 'state') ?>

    <?php // echo $form->field($model, 'country') ?>

    <?php // echo $form->field($model, 'postal_code') ?>

    <?php // echo $form->field($model, 'phone') ?>

    <?php // echo $form->field($model, 'notes') ?>

    <?php // echo $form->field($model, 'dance_partner') ?>

    <?php // echo $form->field($model, 'dance_partner_nationality') ?>

    <div class="form-group">
        <?php echo Html::submitButton(Yii::t('common', 'Search'), ['class' => 'btn btn-primary']) ?>
        <?php echo Html::resetButton(Yii::t('common', 'Reset'), ['class' => 'btn btn-default']) ?>
    </div>

    <?php ActiveForm::end(); ?>

</div>
