<?php

//cases 

use yii\jui\DatePicker;
use yii\helpers\Html;
use kartik\grid\GridView;
use yii\helpers\Url;
use common\models\UserProfile;
use common\models\User;
use \common\models\BookCategory;
use \common\models\Author;
use common\models\Bookmark;
use yii\helpers\ArrayHelper;

/* @var $this yii\web\View */
/* @var $searchModel app\models\CustomersSearch */
/* @var $dataProvider yii\data\ActiveDataProvider 
 */

$this->title = " List of Bookmarks";
?>
<div class="col-md-12" id="bookmark-index">
    <?php //echo $this->render('_search', ['model' => $searchModel]);    ?>
    <?php
    $gridColumns = [
        [
            'attribute' => 'type',
            'value' => function ($model) {
                return Bookmark::$bookmarkTypes[$model->type];
            },
            'hAlign' => 'left',
            'format' => 'raw',
        ],
        [
            'attribute' => 'title',
            'hAlign' => 'left',
            'width' => '300px',
        ],
        [
            'attribute' => 'author',
            'hAlign' => 'left',
        ],
        [
            'attribute' => 'url',
            'hAlign' => 'left',
        ],
        [
            'class' => 'yii\grid\ActionColumn',
            'template' => '{delete}'
        ],
        [
            'class' => 'kartik\grid\ActionColumn',
            'template' => '{view_book}',
            'header' => 'View Bookmark',
            'buttons' => [
                'view_book' => function ($url, $model) {
                    return Html::a('<i class="glyphicon glyphicon-eye-open"></i>', $url, ['class' => 'btn btn-view'], [
                                'title' => Yii::t('app', 'View book'),
                    ]);
                }
            ],
            'urlCreator' => function ($action, $model, $key, $index) {
                if ($action === 'view_book') {
                    if ($model->type == 1) {
                        $url = Yii::$app->urlManager->createUrl(array('book/' . $model->url));
                    } else {
                        $url = Yii::$app->urlManager->createUrl(array('article/' . $model->url));
                    }
                    return $url;
                }
            }
        ],
    ];
    ?>


<?=
GridView::widget([
    'id' => 'grid-cases',
    'dataProvider' => $model,
    //'filterModel' => $searchModel,
    'resizableColumns' => false,
    'showPageSummary' => false,
    'headerRowOptions' => ['class' => 'kartik-sheet-style'],
    'filterRowOptions' => ['class' => 'kartik-sheet-style'],
    'responsive' => true,
    'pjax' => true, // pjax is set to always true for this demo
    'pjaxSettings' => [
        'neverTimeout' => true,
    ],
    'hover' => true,
    'panel' => [
        'heading' => '<h3 class="panel-title"><i class="glyphicon glyphicon-book"></i>' . $this->title . '</h3>',
        'type' => 'primary',
        'showFooter' => false
    ],
    'columns' => $gridColumns,
    // set export properties
    'export' => [
        'fontAwesome' => true,
        'showConfirmAlert' => false,
        'target' => GridView::TARGET_BLANK
    ],
    // set your toolbar
    'toolbar' => [
        '',
    ],
]);
?>

</div>
