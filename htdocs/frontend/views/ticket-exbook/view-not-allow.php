<?php
/* @var $this yii\web\View */
/* @var $model common\models\Book */

//(isset($model->recommendation->recommendation) ? $model->recommendation->recommendation : false);


use yii\web\JsExpression;
use common\models\UserProfile;
use yii\helpers\Html;
use common\helpers\OeHelpers;
use yii\helpers\BaseStringHelper;
use yii\widgets\Pjax;
use kartik\tree\TreeView;
use common\models\BookCategoryTree;
use yii\bootstrap\Collapse;
use \common\widgets\DbText;

$this->title = $model->title;
$this->params['breadcrumbs'][] = ['label' => Yii::t('frontend', 'Books'), 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;

$emailSubjectLink = '';
?>

<div id="flash-message"></div>

<div id="book-detail">

    <?php
    if (Yii::$app->user->can("administrator")) {
        $url = Yii::$app->urlManager->createUrl(array('/admin/book/update?id=' . $model->id));
        $this->params['toptoolbar'][] = [
            'label' => '',
            'id' => 'toolbar-edit',
            'url' => $url,
            'alt' => 'Edit in backend',
            'target' => '_blank',
            'class' => 'btn btn-md btn-success glyphicon glyphicon-pencil'];
    };
    ?>
    <div class="row" id="wrap-book">
        <div class="col-lg-9">
            <div id="main" class="row not-allowed-book">
                <div class="col-lg-3">
                    <div class="cover">
                        <?php if ($model->thumbnail_path): ?>
                            <?php
                            echo \yii\helpers\Html::img(
                                    Yii::$app->glide->createSignedUrl([
                                        'glide/index',
                                        'path' => $model->thumbnail_path,
                                        'w' => 90
                                            ], true), ['class' => 'book-thumb img-rounded pull-left']
                            )
                            ?>
                        <?php else: ?>
                            <img src="/dist/img/generic/no-cover.jpg">
                        <?php endif; ?>
                    </div>
                </div>
                <div class="col-lg-8">
                    <div class="row">
                        <div class="category"><?= (isset($model->category->name) ? $model->category->name : false); ?></div>
                        <div class="category other-category"><?= (isset($model->otherCategories) ? $model->otherCategories : false); ?></div>
                    </div>
                    <div class="title"><?= $model->title; ?></div>
                    <div class="author"><?= $model->author->name; ?></div>

                    <div class="submission <?= ($model->official_submission === 0 ? "non-official" : "official"); ?>">
                        <span class="glyphicon glyphicon-flag"></span>
                        <?= $model->submission . " - " . Yii::$app->formatter->asDate($model->updated_at, 'dd MMM yyyy'); ?>
                    </div>


                </div>

            </div>
            <div class="devider"></div>       
            <div id="book-rights" class="row">
                <div class="col-lg-12">
                    <?php if (Yii::$app->user->can("administrator")): ?>                
                        <div class="row">                   
                            <div class="text-right">
                                <?=
                                Html::a('<i class="glyphicon glyphicon-pencil"></i>', Yii::$app->urlManager->createUrl(array('/admin/widget-text/update?id=14')), ['class' => 'btn btn-success', 'target' => '_blank']);
                                ?>
                            </div>
                        </div>
                    <?php endif; ?>
                    <div id="not-allowed-content">
                        <?= str_replace("%name%", Yii::$app->user->identity->getPublicIdentity(), DbText::widget(['key' => 'no-allowed-book'])); ?>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-lg-3 no-margins-padding">
            <div id="author" class="not-allowed-book">
                <div id="photo">
                    <?php if ($model->author->thumbnail_path): ?>
                        <?php
                        echo \yii\helpers\Html::img(
                                Yii::$app->glide->createSignedUrl([
                                    'glide/index',
                                    'path' => $model->author->thumbnail_path,
                                    'w' => 150
                                        ], true), ['class' => 'img-circle']
                        )
                        ?>
                    <?php else: ?>
                        <img class="img-circle" src="/dist/img/generic/no-author.jpg">
                    <?php endif; ?>
                </div>
                <div id="name"><?= $model->author->name; ?></div>
                <?php if (!empty($model->country)): ?>                    
                    <div id="origin">from <?= $model->country->country_name; ?></div>
                <?php endif; ?>
                <?php if (!empty($model->origin_comment)): ?>                    
                    <div id="origin-comment"><?= $model->origin_comment; ?></div>
                <?php endif; ?>
                <div id="about">
                    <?= $model->author->bio; ?>
                </div>
            </div>
        </div>
    </div>
</div>
