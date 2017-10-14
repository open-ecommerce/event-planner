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
/* @var $dataProvider yii\data\ActiveDataProvider */

$this->title = " List of Bookmarks";
?>
<div class="col-md-12" id="bookmark-index-mobile">
    <?php //echo $this->render('_search', ['model' => $searchModel]);    ?>
    <?php
    $gridColumns = [
//        [
//            'attribute' => 'type',
//            'value' => function ($data) {
//                return Bookmark::$bookmarkTypes[1];
//            },
//            'hAlign' => 'center',
//            'vAlign' => 'middle',
//            'format' => 'raw',
//        ],
//        [
//            'attribute' => 'url',
//            'hAlign' => 'center',
//            'vAlign' => 'middle',
//        ],
        [
            'label' => false,
            'attribute' => 'book',
            'value' => function ($model, $key, $index, $widget) {

                $tagHot =  ($model->book->hot === 1 ? '<span class="book-tag hot">HOT</span>' : '');
                $tagLoved =  ($model->book->loved === 1 ? '<span class="book-tag loved">LOVED</span>' : '');
                $tagEssential =  ($model->book->essential === 1 ? '<span class="book-tag essential">ESSENTIAL</span>' : '');
        
                $tagBookmark =  '<span class="book-tag-bookmark glyphicon glyphicon-bookmark active"></span>';
                
                
                $updatedAt = (Yii::$app->formatter->asDate($model->book->updated_at, 'yyy-MM-dd') === Yii::$app->formatter->asDate('now', 'yyyy-MM-dd') ? Yii::$app->formatter->asDate($model->book->updated_at, 'h:mm a') : Yii::$app->formatter->asDate($model->book->updated_at, 'dd MMM y'));                
        
                $mobileBook = '<div class="category">';
                $mobileBook .= '<span>' . (!empty($model->book->category->name) ? $model->book->category->name : false) . '</span>';
                //$mobileBook .= $editBook;
                $mobileBook .= $tagBookmark . $tagHot . $tagEssential . $tagLoved;
                $mobileBook .= '</div>';
                $mobileBook .= '<div class="title">';
                $mobileBook .= '<a href="/book/' . $model->book->slug . '">' . $model->book->title . '</a>';
                $mobileBook .= '</div>';
                $mobileBook .= '<div class="author"><a href="/book/' . $model->book->slug . '">by ' . $model->author->name . '</a></div>';
                $mobileBook .= '<div class="updated-at">' . $updatedAt . '</div>';
                //$mobileBook .= '<div class="updated-at">' . Yii::$app->formatter->asDate($model->updated_at, 'dd MMM yyyy') . '</div>';

                return $mobileBook;
                //return Html::a($model->title, '/book/' . $model->slug, ['title' => 'View book', 'target' => '_blank', 'alt' => 'Link to Frontend',]);
            },
            'format' => 'raw'
        ],
        [
            'class' => 'kartik\grid\ExpandRowColumn',
            'width' => '5px',
            'value' => function ($model, $key, $index, $column) {
                return GridView::ROW_COLLAPSED;
            },
            'detail' => function ($model, $key, $index, $column) {
                return Yii::$app->controller->renderPartial('_expand-bookmark-details', ['model' => $model]);
            },
            'headerOptions' => ['class' => 'kartik-sheet-style'],
            'expandOneOnly' => true,
            'expandIcon' => '<span class="glyphicon glyphicon-plus"></span><span class="mobile-view-more"> expand</span>',
            'collapseIcon' => '<span class="glyphicon glyphicon-minus"></span><span class="mobile-view-more"> collapse</span>',
        ],                    
//        [
//            'class' => 'kartik\grid\ActionColumn',
//            'template' => '{view_book}',
//            'header' => 'View Bookmark',
//            'visible' => (Yii::$app->user->can("administrator")),
//            'buttons' => [
//                'view_book' => function ($url, $model) {
//                    return Html::a('<i class="glyphicon glyphicon-eye-open"></i>', $url, ['class' => 'btn btn-success'], [
//                                'title' => Yii::t('app', 'View book'),
//                    ]);
//                }
//            ],
//            'urlCreator' => function ($action, $model, $key, $index) {
//                if ($action === 'view_book') {
//                    $url = Yii::$app->urlManager->createUrl(array('book/' . $model->url));
//                    return $url;
//                }
//            }
//        ],
    ];
    ?>

    <?=
    GridView::widget([
        'id' => 'grid-cases-mobile',
        'dataProvider' => $model,
        'resizableColumns' => false,
        'showPageSummary' => false,
        'responsive' => false,
        'pjax' => true, // pjax is set to always true for this demo
        'pjaxSettings' => [
            'neverTimeout' => true,
        ],
        'hover' => true,
        'panel' => [
            'heading' => '<h3 class="panel-title"><i class="glyphicon glyphicon-book"></i>' . $this->title . '</h3>',
            'type' => 'primary books',
            'showFooter' => false,
            'showHeader' => false,
            'before' => false,
            ['content' => ''],
        ],
        'columns' => $gridColumns,
        'rowOptions' => ['class' => 'book-mobile-row'],
        // set your toolbar
        'toolbar' => [],
    ]);
    ?>

</div>
