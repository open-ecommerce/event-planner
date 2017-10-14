<?php

use yii\helpers\Html;
use yii\bootstrap\ActiveForm;

/* @var $this yii\web\View */
/* @var $model common\models\Ticket */
/* @var $form yii\bootstrap\ActiveForm */
?>

<div class="ticket-form">

    <?php $form = ActiveForm::begin(); ?>

    <?php echo $form->errorSummary($model); ?>

    <?php echo $form->field($model, 'id')->textInput() ?>

    <?php echo $form->field($model, 'barcode')->textInput() ?>

    <?php echo $form->field($model, 'transaction_id')->textInput() ?>

    <?php echo $form->field($model, 'attendee_id')->textInput() ?>

    <?php echo $form->field($model, 'registration_id')->textInput() ?>

    <?php echo $form->field($model, 'registration_time')->textInput() ?>

    <?php echo $form->field($model, 'registration_code')->textInput(['maxlength' => true]) ?>

    <?php echo $form->field($model, 'registration_status')->textInput(['maxlength' => true]) ?>

    <?php echo $form->field($model, 'transaction_status')->textInput(['maxlength' => true]) ?>

    <?php echo $form->field($model, 'transaction_amount')->textInput() ?>

    <?php echo $form->field($model, 'amount_paid')->textInput() ?>

    <?php echo $form->field($model, 'payment_date')->textInput() ?>

    <?php echo $form->field($model, 'payment_method')->textInput(['maxlength' => true]) ?>

    <?php echo $form->field($model, 'geteway_transaction')->textInput(['maxlength' => true]) ?>

    <?php echo $form->field($model, 'ticket_name')->textInput(['maxlength' => true]) ?>

    <?php echo $form->field($model, 'ticket_date')->textInput() ?>

    <?php echo $form->field($model, 'first_name')->textInput(['maxlength' => true]) ?>

    <?php echo $form->field($model, 'last_name')->textInput(['maxlength' => true]) ?>

    <?php echo $form->field($model, 'email')->textInput(['maxlength' => true]) ?>

    <?php echo $form->field($model, 'address_1')->textInput(['maxlength' => true]) ?>

    <?php echo $form->field($model, 'address_2')->textInput(['maxlength' => true]) ?>

    <?php echo $form->field($model, 'city')->textInput(['maxlength' => true]) ?>

    <?php echo $form->field($model, 'state')->textInput(['maxlength' => true]) ?>

    <?php echo $form->field($model, 'country')->textInput(['maxlength' => true]) ?>

    <?php echo $form->field($model, 'postal_code')->textInput(['maxlength' => true]) ?>

    <?php echo $form->field($model, 'phone')->textInput(['maxlength' => true]) ?>

    <?php echo $form->field($model, 'notes')->textarea(['rows' => 6]) ?>

    <?php echo $form->field($model, 'dance_partner')->textInput(['maxlength' => true]) ?>

    <?php echo $form->field($model, 'dance_partner_nationality')->textInput(['maxlength' => true]) ?>

    <div class="form-group">
        <?php echo Html::submitButton($model->isNewRecord ? Yii::t('common', 'Create') : Yii::t('common', 'Update'), ['class' => $model->isNewRecord ? 'btn btn-success' : 'btn btn-primary']) ?>
    </div>

    <?php ActiveForm::end(); ?>

</div>
