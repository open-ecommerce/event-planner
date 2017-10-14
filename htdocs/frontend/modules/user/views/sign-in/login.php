<?php

use yii\helpers\Html;
//use yii\bootstrap\ActiveForm;
use kartik\form\ActiveForm;

//use kartik\widgets\SwitchInput;

/* @var $this yii\web\View */
/* @var $form yii\bootstrap\ActiveForm */
/* @var $model \backend\models\LoginForm */

$this->title = Yii::t('frontend', 'Sign in to the system');
$this->params['body-class'] = 'login-page';
?>


<div id="login-wraper">

    <div class="login-box">
        <div class="header"></div>
        <div class="login-box-body">
            <div class="login-logo">
                <?php echo Html::encode($this->title) ?>
            </div>
            <?php $form = ActiveForm::begin(['id' => 'login-form']); ?>
            <div class="body">

                <?php
                echo $form->field($model, 'identity', [
                    'inputOptions' => ['autofocus' => 'autofocus', 'class' => 'form-control transparent']                    
                ])->textInput()->input('identity', ['placeholder' => ""])->label("Username or Email");
                echo $form->field($model, 'password', [
                    'inputOptions' => ['autofocus' => 'autofocus', 'class' => 'form-control transparent'],
                ])->passwordInput()->input('password', ['placeholder' => ''])->label("Password");
                ?>            

                <?php
                //echo SwitchInput::widget(['name' => 'reveal-password', 'value' => true]);
//            echo SwitchInput::widget([
//                'name' => 'reveal-password',
//                'id' => 'reveal-password',
//                'value' => '-1',                
//                'pluginOptions' => [
//                    'handleWidth' => 30,
//                    'onText' => '***',
//                    'offText' => 'ABC'
//                ]
//            ]);
                ?>

                <div class="row">
                    <div class="col-xs-6">
                        <?php echo $form->field($model, 'rememberMe')->checkbox() ?>                        
                    </div>

                    <div class="col-xs-6">
                        <div class="no-password-link">

                            <?php
                            echo Yii::t('frontend', '<a href="{link}">Forgot details?</a>', [
                                'link' => yii\helpers\Url::to(['sign-in/request-password-reset'])
                            ])
                            ?>
                        </div>
                    </div>
                </div>

            </div>
            <div class="row login-button">            
                <?php
                echo Html::submitButton(Yii::t('frontend', 'Sign me in'), [
                    'class' => 'btn btn-login btn-flat btn-block',
                    'name' => 'login-button'
                ])
                ?>
            </div>
            <?php ActiveForm::end(); ?>
        </div>

    </div>

</div>    

<?php
//$this->registerJs("jQuery('#reveal-password').change(function(){jQuery('#loginform-password').attr('type',this.checked?'text':'password');})");
?>