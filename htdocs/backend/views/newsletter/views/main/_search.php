<?php

use yii\helpers\Html;
use yii\widgets\ActiveForm;

/* @var $this yii\web\View */
/* @var $model app\models\EqueueSearch */
/* @var $form yii\widgets\ActiveForm */
?>

<div class="main-search">

    <?php $form = ActiveForm::begin([
        'action' => ['index'],
        'method' => 'get',
    ]); ?>

    <?= $form->field($model, 'id') ?>

    <?= $form->field($model, 'from') ?>

    <?= $form->field($model, 'to') ?>

    <?= $form->field($model, 'cc') ?>

    <?= $form->field($model, 'bcc') ?>

    <?php // echo $form->field($model, 'subject') ?>

    <?php // echo $form->field($model, 'html_body') ?>

    <?php // echo $form->field($model, 'text_body') ?>

    <?php // echo $form->field($model, 'attachment') ?>

    <?php // echo $form->field($model, 'reply_to') ?>

    <?php // echo $form->field($model, 'charset') ?>

    <?php // echo $form->field($model, 'created_at') ?>

    <?php // echo $form->field($model, 'attempts') ?>

    <?php // echo $form->field($model, 'last_attempt_time') ?>

    <?php // echo $form->field($model, 'sent_time') ?>

    <div class="form-group">
        <?= Html::submitButton('Search', ['class' => 'btn btn-primary']) ?>
        <?= Html::resetButton('Reset', ['class' => 'btn btn-default']) ?>
    </div>

    <?php ActiveForm::end(); ?>

</div>
