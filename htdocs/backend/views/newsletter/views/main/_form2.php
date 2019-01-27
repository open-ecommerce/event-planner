<?php

use yii\helpers\Html;
use yii\widgets\ActiveForm;

/* @var $this yii\web\View */
/* @var $model app\models\Equeue */
/* @var $form yii\widgets\ActiveForm */
?>

<div class="main-form">

    <?php $form = ActiveForm::begin(['id' => $model->formName(),'options'=>['enctype'=>'multipart/form-data']]); ?>
    
    <?= $form->field($model, 'to')->textInput()->label(FALSE) ?>
    
    <?= $form->field($model, 'cc')->textInput()->label(FALSE) ?>
    
    <?= $form->field($model, 'bcc')->textInput()->label(FALSE) ?>
    
    <?= $form->field($model, 'subject')->textInput(['maxlength' => true]) ?>

   
    <div class="form-group">
        <?= Html::submitButton($model->isNewRecord ? 'Send' : 'Update', ['class' => $model->isNewRecord ? 'btn btn-success' : 'btn btn-primary']) ?>
    </div>

    <?php ActiveForm::end(); ?>

</div>
