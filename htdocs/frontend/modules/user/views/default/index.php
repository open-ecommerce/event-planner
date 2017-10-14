<?php

use trntv\filekit\widget\Upload;
use yii\helpers\Html;
use yii\widgets\ActiveForm;
use jlorente\remainingcharacters\RemainingCharacters;

/* @var $this yii\web\View */
/* @var $model common\base\MultiModel */
/* @var $form yii\widgets\ActiveForm */

$this->title = Yii::t('frontend', 'User Settings')
?>

<div class="user-profile-form">

    <?php $form = ActiveForm::begin(); ?>

    <h2><?php echo Yii::t('frontSend', 'Profile settings') ?></h2>


    <div class="row" id="update-profile">
        <div class="col-md-6" id="wrap-main">
            <div class="col-md-4">
                <?php
                echo $form->field($model->getModel('profile'), 'picture')->widget(
                        Upload::classname(), [
                    'url' => ['avatar-upload'],
                    'maxFileSize' => 5 * 1024 * 1024, // 10 MiB            
                        ]
                )
                ?>
            </div>
            <div class="col-md-8">
                <?php echo $form->field($model->getModel('profile'), 'firstname')->textInput(['maxlength' => 255]) ?>
                <?php echo $form->field($model->getModel('profile'), 'lastname')->textInput(['maxlength' => 255]) ?>
                <?php echo $form->field($model->getModel('profile'), 'job_title')->textInput(['maxlength' => 255]) ?>
            </div>

            <?php
            echo $form->field($model->getModel('profile'), 'about')->widget(RemainingCharacters::classname(), [
                'type' => RemainingCharacters::INPUT_TEXTAREA,
                'text' => Yii::t('app', '{n} characters remaining'),
                'label' => [
                    'tag' => 'p',
                    'id' => 'lbl-about',
                    'class' => 'counter',
                    'invalidClass' => 'error',
                ],
                'options' => [
                    'rows' => '4',
                    'class' => 'txt-about',
                    'maxlength' => 370,
                    'placeholder' => Yii::t('app', 'Please write the rational for the recommendation'),
                ],
            ]);
            ?>

        </div>
        <div class="col-md-6" id='wrap-detail'>
            <?php
            echo $form->field($model->getModel('profile'), 'books_published')->widget(RemainingCharacters::classname(), [
                'type' => RemainingCharacters::INPUT_TEXTAREA,
                'text' => Yii::t('app', '{n} characters remaining'),
                'label' => [
                    'tag' => 'p',
                    'id' => 'lbl-published',
                    'class' => 'counter',
                    'invalidClass' => 'error',
                ],
                'options' => [
                    'rows' => '4',
                    'class' => 'txt-published',
                    'maxlength' => 370,
                    'placeholder' => Yii::t('app', 'Please write the rational for the recommendation'),
                ],
            ]);
            ?>
            <?php
            echo $form->field($model->getModel('profile'), 'wished_you_published')->widget(RemainingCharacters::classname(), [
                'type' => RemainingCharacters::INPUT_TEXTAREA,
                'text' => Yii::t('app', '{n} characters remaining'),
                'label' => [
                    'tag' => 'p',
                    'id' => 'lbl-iwish',
                    'class' => 'counter',
                    'invalidClass' => 'error',
                ],
                'options' => [
                    'rows' => '4',
                    'class' => 'txt-iwish',
                    'maxlength' => 370,
                    'placeholder' => Yii::t('app', 'Please write the rational for the recommendation'),
                ],
            ]);
            ?>
        </div>
    </div>    


            <h2><?php echo Yii::t('frontend', 'Account Settings') ?></h2>

            <?php echo $form->field($model->getModel('account'), 'username') ?>

            <?php echo $form->field($model->getModel('account'), 'email') ?>

            <?php echo $form->field($model->getModel('account'), 'password')->passwordInput() ?>

            <?php echo $form->field($model->getModel('account'), 'password_confirm')->passwordInput() ?>






    <div class="form-group">
        <?php echo Html::submitButton(Yii::t('frontend', 'Update'), ['class' => 'btn btn-primary']) ?>
    </div>

    <?php ActiveForm::end(); ?>

</div>
