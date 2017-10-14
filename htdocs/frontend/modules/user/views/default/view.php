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
                    <div class="position"><?= $model->getModel('profile')->job_title ?></div>
                </figure>

            </div>
            <div class="col-md-6" id='col-detail'>
                <div id="toolbar">
                    <?php
                    $url = Yii::$app->urlManager->createUrl(array('/user/default/update'));
                    echo '<span>' . Html::a('<i class="glyphicon glyphicon-pencil"></i> Edit your profile', [$url], ['class' => 'btn btn-success']) . '</span>';
                    ?>
                </div>
                <div class="row" id="wrap-detail">
                    <div class="block">
                        <div class="title">Venue</div>        
                        <div class="body">
                            <?php
                            if (!empty($model->getModel('profile')->venue->name)) {
                                echo '<strong>'.$model->getModel('profile')->venue->name."</strong><br>";
                                echo $model->getModel('profile')->venue->address_1."<br>";
                                echo $model->getModel('profile')->venue->address_2." ";
                                echo $model->getModel('profile')->venue->address_3."<br>";
                                echo $model->getModel('profile')->venue->postal_code."<br>";
                                echo $model->getModel('profile')->venue->city."<br>";
                            } else {
                                echo "Venue not set";
                            }
                            ?>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
