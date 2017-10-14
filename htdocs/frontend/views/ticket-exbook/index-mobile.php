<?php

//cases 

use kartik\daterange\DateRangePicker;
use yii\helpers\Html;
use kartik\grid\GridView;
use yii\helpers\Url;
use common\models\UserProfile;
use common\models\User;
use common\models\Contact;
use common\models\Country;
use common\models\BookCategoryTree;
use \common\models\Author;
use yii\helpers\ArrayHelper;
use common\models\BookIndex;
use yii\helpers\BaseStringHelper;

/* @var $this yii\web\View */
/* @var $searchModel app\models\CustomersSearch */
/* @var $dataProvider yii\data\ActiveDataProvider 

  <?php
  echo $form->field($model, 'category_id')->dropDownList(\yii\helpers\ArrayHelper::map(
  $categories, 'id', 'title'
  ), ['prompt' => ''])
  ?>


  <?=
  $form->field($model, 'report_by')->dropDownList(\yii\helpers\ArrayHelper::map(common\models\UserProfile::find()->orderBy('lastname')->all(), 'user_id', function($model, $defaultValue) {
  return $model['firstname'] . ' ' . $model['lastname'];
  })
  )
  ?>

 */

//$advancedForm = $this->render('_search', array('model' => $searchModel));


$this->title = "  Books";
?>

<div id="book-index" class="col-md-12">
    <?php //echo $this->render('_search', ['model' => $searchModel]);    ?>
    <?php
    $headerBar = $this->render('_search-global', array('model' => $searchModel));

    echo $headerBar;

    //echo Html::button('Advanced Search <i class="glyphicon glyphicon-chevron-down"></i>', ['type' => 'button', 'title' => Yii::t('kvgrid', 'Add Book'), 'class' => 'btn btn-success', 'id' => 'extended-search-lnk']);


    $gridColumns = [
//        [
//            'attribute' => 'favourite',
//            'label' => false,
//            'value' => 'favoritedIcon',
//            'format' => 'raw',
//        ],
        [
            'label' => false,
            'attribute' => 'book',
            //'contentOptions' => ['class' => 'possible class'],
            'value' => function ($model, $key, $index, $widget) {

                $tagHot = ($model->hot === 1 ? '<span class="book-tag hot">HOT</span>' : '');
                $tagLoved = ($model->loved === 1 ? '<span class="book-tag loved">LOVED</span>' : '');
                $tagEssential = ($model->essential === 1 ? '<span class="book-tag essential">ESS</span>' : '');
                $tagBookmark = ($model->bookmarked === ' active' ? '<span class="book-tag-bookmark glyphicon glyphicon-bookmark active"></span>' : '');

                $updatedAt = (Yii::$app->formatter->asDate($model->updated_at, 'yyy-MM-dd') === Yii::$app->formatter->asDate('now', 'yyyy-MM-dd') ? Yii::$app->formatter->asDate($model->updated_at, 'h:mm a') : Yii::$app->formatter->asDate($model->updated_at, 'dd MMM y'));

                $mobileBook = '<div class="category">';
                $mobileBook .= '<span>' . (!empty($model->category->name) ? $model->category->name : false) . '</span>';
                //$mobileBook .= $editBook;
                $mobileBook .= $tagBookmark . $tagHot . $tagEssential . $tagLoved;
                $mobileBook .= '</div>';
                $mobileBook .= '<div class="title'.$model->favorited.'">' . $model->favoritedIcon;
                $mobileBook .= '<a href="/book/' . $model->slug . '">' . $model->title . '</a>';
                $mobileBook .= '</div>';
                $mobileBook .= '<div class="author"><a href="/book/' . $model->slug . '">by ' . $model->author->name . '</a></div>';
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
                return Yii::$app->controller->renderPartial('_expand-book-details', ['model' => $model]);
            },
            'headerOptions' => ['class' => 'kartik-sheet-style'],
            'expandOneOnly' => true,
            'expandIcon' => '<span class="glyphicon glyphicon-plus"></span><span class="mobile-view-more"> expand</span>',
            'collapseIcon' => '<span class="glyphicon glyphicon-minus"></span><span class="mobile-view-more"> collapse</span>',
        ],
//        [
//            'label' => false,
//            'attribute' => 'author_id',
//            'value' => 'author.name',
//            'format' => 'raw'
//        ],
//        [
//            'label' => false,
//            'attribute' => 'category_id',
//            //'value' => 'category.name',
//            'value' => 'allCategories',
//            'format' => 'raw'
//        ],
//        [
//            'label' => false,
//            'attribute' => 'updated_at',
//            'format' => 'date',
//        ],
//        [
//            'label' => false,
//            'attribute' => 'publisher_id',
//            'value' => 'publisher.name',
//            'format' => 'raw'
//        ],
//        [
//            'label' => false,
//            'attribute' => 'country_id',
//            'value' => 'country.country_name',
//            'format' => 'raw'
//        ],
    ];
    ?>


    <?=
    GridView::widget([
        'id' => 'grid-cases-mobile',
        'dataProvider' => $dataProvider,
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
            ['content' => $headerBar],
        ],
        'columns' => $gridColumns,
        'rowOptions' => ['class' => 'book-mobile-row'],
        // set your toolbar
        'toolbar' => [],
    ]);
    ?>

</div>

