<?php

use trntv\filekit\widget\Upload;
use yii\helpers\Html;
use yii\widgets\ActiveForm;

/* @var $this yii\web\View */
/* @var $model common\base\MultiModel */
/* @var $form yii\widgets\ActiveForm */

$this->title = Yii::t('frontend', 'User Settings');

if (!empty($model->getModel('profile')->avatar_path)) {
    $avatar = $model->getModel('profile')->avatar;
} else {
    //$avatar = "/dist/img/generic/no-cover.jpg";
    $avatar = "https://robohash.org/set_set1/" . $model->getModel('profile')->firstname . "?size=440x440";
}

?>

<div class="container" id="view-profile">

    <div class="row" id="wrap-profile">
        <div class="col-lg12" id="wrap-main">
            <div class="col-md-6" id="wrap-main">
                <figure class="profile red">
                    <figcaption>
                        <h2><?= $model->getModel('profile')->firstname ?> <span><?= $model->getModel('profile')->lastname ?></span></h2>
                        <p><?= $model->getModel('profile')->about ?></p>
                        <div class="icons"><a href="#"><i class="ion-ios-home"></i></a><a href="#"><i class="ion-ios-email"></i></a><a href="#"><i class="ion-ios-telephone"></i></a></div>
                    </figcaption>
                    <div class="image"><img src="<?php echo $avatar; ?>" alt="sample4"/></div>
                    <div class="position">
                    <?= (!empty($model->getModel('profile')->job_title) ? $model->getModel('profile')->job_title : "") .'<br>'. 
                        (!empty($model->getModel('profile')->company->name) ? $model->getModel('profile')->company->name : "") . ' - ' . 
                        (!empty($model->getModel('profile')->companyCountryName) ? $model->getModel('profile')->companyCountryName : "") ?>
                    </div>
                </figure>

            </div>
            <div class="col-md-6" id='col-detail'>
                <div class="row" id="wrap-detail">
                    <div class="block">
                        <div class="title">Languages Spoken</div>
                        <div class="body"><?= $model->getModel('profile')->langNames ?></div>
                    </div>
                    <div class="block">
                        <div class="title">Languages of Interest</div>
                        <div class="body"><?= $model->getModel('profile')->langiNames ?></div>
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
</div>
