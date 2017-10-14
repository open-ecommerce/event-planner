<?php

use trntv\filekit\widget\Upload;
use yii\helpers\Html;
use yii\widgets\ActiveForm;
use jlorente\remainingcharacters\RemainingCharacters;
use dosamigos\selectize\SelectizeTextInput;
use dosamigos\selectize\SelectizeDropDownList;
use kartik\tree\TreeViewInput;
use common\models\BookCategoryTree;
use \marqu3s\summernote\Summernote;
use common\models\Venue;

/* @var $this yii\web\View */
/* @var $model common\base\MultiModel */
/* @var $form yii\widgets\ActiveForm */

$this->title = Yii::t('frontend', 'User Settings')
?>

<div id="user-profile-form">
    <?php $form = ActiveForm::begin(); ?>
    <div class="row" id="update-profile">
        <div class="col-md-6" id="wrap-main">
            <div class="row">
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
                </div>
            </div>

            <?php
            echo $form->field($model->getModel('profile'), 'job_title')->textInput(['maxlength' => 255])->label("Job title at " . (isset($model->getModel('profile')->publishing_house_id) ? $model->getModel('profile')->company->name : false));
            echo $form->field($model->getModel('profile'), 'about')->widget(Summernote::className(), [
                'clientOptions' => [
                    'id' => 'notes-summernote',
                    'height' => 250,
                    'toolbar' => [
                        ['undo', ['undo']],
                        ['redo', ['redo']],
                    ]
                ],
                    ]
            );
            ?>
        </div>
        <div class="col-md-6" id='wrap-detail'>
            <div id="toolbar-update">
                <?php
                $url = Yii::$app->urlManager->createUrl(array('/user/default/update'));
                echo Html::submitButton('<i class="fa fa-save"></i> ' . Yii::t('frontend', 'Save & View'), ['class' => 'btn btn-success']);
                ?>                    
            </div>
            <?=
            $form->field($model->getModel('profile'), 'venue_id')->dropDownList(\yii\helpers\ArrayHelper::map(Venue::find()
                                    ->orderBy('name')
                                    ->all(), 'id', 'name'
                    ), ['prompt' => 'Select the venue where this user will be Checking']);
            ?>

        </div>
    </div>    

    <div class="row" id="update-second-row">
        <h3><?php echo Yii::t('frontend', 'Account Settings') ?></h3>
        <div class="col-md-6" id="wrap-account">
            <?php echo $form->field($model->getModel('account'), 'username')->textInput(['readonly' => 'true']) ?>
            <?php echo $form->field($model->getModel('account'), 'email') ?>
        </div>
        <div class="col-md-6" id="wrap-main">
            <?php echo $form->field($model->getModel('account'), 'password')->passwordInput() ?>
            <?php echo $form->field($model->getModel('account'), 'password_confirm')->passwordInput() ?>
        </div>    
    </div>    

    <div class="row" id="bootom-toolbar">
        <?php
        $url = Yii::$app->urlManager->createUrl(array('/user/default/update'));
        echo Html::submitButton('<i class="fa fa-save"></i> ' . Yii::t('frontend', 'Save & View'), ['class' => 'btn btn-success']);
        ?>                    
    </div>

    <?php ActiveForm::end(); ?>

</div>
