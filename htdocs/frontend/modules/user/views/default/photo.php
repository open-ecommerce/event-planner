<?php

use yii\helpers\Html;
use yii\widgets\ActiveForm;



/* @var $this yii\web\View */
/* @var $model common\base\MultiModel */
/* @var $form yii\widgets\ActiveForm */

$this->title = Yii::t('frontend', 'User Settings');
        
        
$imageSrc = $profile->avatar_path;        
        
?>

<div class="user-profile-form">

    <?php $form = ActiveForm::begin(); ?>

    <h2><?php echo Yii::t('frontend', 'Profile settings') ?></h2>

<?php
echo \dpodium\yii2\widget\upload\crop\UploadCrop::widget(
    [
        'form' => $form,
        'model' => $profile,
        'attribute' => 'avatar',
        'maxSize' => 400,
        'imageSrc' => (isset($imageSrc)) ? $$imageSrc : '',
        'title' => Yii::t('admin', 'Crop photo'),
        'changePhotoTitle' => Yii::t('frontend', 'Change photo peeeeeeeeeese'),
        'jcropOptions' => [
            'dragMode' => 'move',
            'viewMode' => 1,
            'autoCropArea' => '0.1',
            'restore' => false,
            'guides' => false,
            'center' => false,
            'movable' => true,
            'highlight' => false,
            'cropBoxMovable' => false,
            'cropBoxResizable' => false,
            'background' => false,
            'minContainerHeight' => 500,
            'minCanvasHeight' => 400,
            'minCropBoxWidth' => 400,
            'minCropBoxHeight' => 400,
            'responsive' => true,
            'toggleDragModeOnDblclick' => false
        ]
    ]
);    
    
  ?>  
    
     <?= Html::img($model->getModel('profile')->avatar); ?>
    
    
    
    
    
    
    <?php echo $form->field($model->getModel('profile'), 'firstname')->textInput(['maxlength' => 255]) ?>
    <?php echo $form->field($model->getModel('profile'), 'lastname')->textInput(['maxlength' => 255]) ?>
    <?php //echo $form->field($model->getModel('profile'), 'about')->textInput(['maxlength' => 255]) ?>



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
