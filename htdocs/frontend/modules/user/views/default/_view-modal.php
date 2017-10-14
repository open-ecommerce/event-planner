<?php

use trntv\filekit\widget\Upload;
use yii\helpers\Html;
use yii\widgets\ActiveForm;

/* @var $this yii\web\View */
/* @var $model common\base\MultiModel */
/* @var $form yii\widgets\ActiveForm */

$this->title = Yii::t('frontend', 'User Settings');

if ($model->getModel('profile', 'picture')) {
    $avatar = $model->getModel('profile')->avatar;
} else {
    $avatar = "/dist/img/generic/no-cover.jpg";
}
?>

<div id="view-profile">
    <div id="wrap-profile" class="row">
        <div id="wrap-main" class="col-sm-12" >
            <figure class="profile red">
                <figcaption>
                    <h2><?= $model->getModel('profile')->firstname ?> <span><?= $model->getModel('profile')->lastname ?></span></h2>
                    <p><?= $model->getModel('profile')->about ?></p>
                    <div class="icons"><a href="#"><i class="ion-ios-home"></i></a><a href="#"><i class="ion-ios-email"></i></a><a href="#"><i class="ion-ios-telephone"></i></a></div>
                </figcaption>
                <div class="image"><img src= <?= $avatar; ?> alt="sample4"/></div>
                <div class="position"><?= $model->getModel('profile')->job_title ?></div>
            </figure>
        </div>
        <div id='col-detail-modal' class='col-sm-12'>
            <div id="wrap-detail">
                    <div class="block">
                        <div class="title"><?= $model->getModel('profile')->getAttributeLabel('languages') ?></div>
                        <div class="body"><?= $model->getModel('profile')->tagNames ?></div>
                    </div>
                    <div class="block">
                        <div class="title"><?= $model->getModel('profile')->getAttributeLabel('books_published') ?></div>
                        <div class="body"><?= $model->getModel('profile')->books_published ?></div>
                    </div>
                    <div class="block">
                        <div class="title"><?= $model->getModel('profile')->getAttributeLabel('wished_you_published') ?></div>
                        <div class="body"><?= $model->getModel('profile')->wished_you_published ?></div>
                    </div>
            </div>
        </div>
    </div>
</div>
