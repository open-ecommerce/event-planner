<?php

use yii\helpers\Html;
//use yii\bootstrap\ActiveForm;
use kartik\form\ActiveForm;

//use kartik\widgets\SwitchInput;

/* @var $this yii\web\View */
/* @var $form yii\bootstrap\ActiveForm */
/* @var $model \backend\models\LoginForm */

$this->title = Yii::t('frontend', 'Request password reset');
$this->params['body-class'] = 'login-page';
?>


<div class="login-box">
    <div class="header"></div>
    <div class="login-box-body">
        <div class="login-logo">
            <?php echo Html::encode($this->title) ?>
        </div>
        <?php $form = ActiveForm::begin(['id' => 'request-password-reset-form']); ?>
        <?php
        echo $form->field($model, 'email', [
            'inputOptions' => ['autofocus' => 'autofocus', 'class' => 'form-control transparent']
        ])->textInput()->input('identity')->label("Your  email");
        ?>

        <div class="row reset-pass-button">            
            <?php
            echo Html::submitButton(Yii::t('frontend', 'Send email with reset password link'), [
                'class' => 'btn btn-reset btn-flat btn-block',
                'name' => 'reset-button'
            ])
            ?>
        </div>        


        <?php ActiveForm::end(); ?>

    </div>
</div>
