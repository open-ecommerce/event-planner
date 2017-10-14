<?php
use kartik\daterange\DateRangePicker;
use yii\helpers\Html;
use kartik\grid\GridView;
use yii\helpers\Url;
use common\models\UserProfile;
use common\models\User;
use yii\helpers\ArrayHelper;
use common\models\ArticleCategory;
use common\models\Article;

/* @var $this yii\web\View */
/* @var $searchModel app\models\CustomersSearch */
/* @var $dataProvider yii\data\ActiveDataProvider 
 */

$this->title = " List of Souths and Murmurs";
?>

<div class="col-md-12" id="articles-index-grid">

    <?php
    $this->params['toptoolbar'][] = [
        'label' => '',
        'url' => '/article/index',
        'id' => 'toolbar-bookmark',
        'alt' => 'Grid View',
        'target' => '_self',
        'class' => 'btn btn-md btn-default glyphicon glyphicon-th-large inactive'];
    $this->params['toptoolbar'][] = [
        'label' => '',
        'url' => '',
        'id' => 'toolbar-bookmark',
        'alt' => 'List View',
        'target' => '_self',
        'class' => 'btn btn-md btn-default glyphicon glyphicon-th-list active'];
    ?>    
    
    
    <?php
    $gridColumns = [
        [
            'attribute' => 'title',
            'vAlign' => 'middle',
            'vAlign' => 'middle',
            'width' => '300px',
//            'value' => function ($model, $key, $index, $widget) {
//                return Html::a($model->title, '/article/' . $model->slug, ['title' => 'View article', 'target' => '_blank', 'alt' => 'Link to Frontend',]);
//            },
            'format' => 'raw'
        ],
        [
            'attribute' => 'author_id',
            'value' => 'author.fullname',
            'label' => 'Author',
            'hAlign' => 'left',
            'vAlign' => 'middle',
            'filterType' => GridView::FILTER_SELECT2,
            'filter' => ArrayHelper::map(UserProfile::find()->all(), 'user_id', 'fullname'),
            'filterWidgetOptions' => [
                'pluginOptions' => ['allowClear' => true],
            ],
            'filterInputOptions' => ['placeholder' => 'Any Author'],
            'format' => 'raw'
        ],        
        [
            'attribute' => 'category_id',
            'value' => 'category.title',
            'label' => 'Category',
            'hAlign' => 'left',
            'vAlign' => 'middle',
            'filterType' => GridView::FILTER_SELECT2,
            'filter' => ArrayHelper::map(ArticleCategory::find()->select(['id', 'title'])->distinct()->orderBy('title')->all(), 'id', 'title'),
            'filterWidgetOptions' => [
                'pluginOptions' => ['allowClear' => true],
            ],
            'filterInputOptions' => ['placeholder' => 'Any Category'],
            'format' => 'raw'
        ],        
        [
            'attribute' => 'updated_at',
            'format' => 'datetime',
            'filterType' => GridView::FILTER_DATE_RANGE,
            'filterWidgetOptions' => ([
                'attribute' => 'updated_at',
                'presetDropdown' => true,
                'convertFormat' => false,
                'pluginOptions' => [
                    'separator' => 'to',
                    'format' => 'DD MMM YYYY',
                    'locale' => [
                        'format' => 'DD MMM YYYY'
                    ],
        ],
        'pluginEvents' => [
            "apply.daterangepicker" => "function() { apply_filter('only_date') }",
        ],
            ])
        ],
                    
                    
        [
            'class' => 'kartik\grid\ActionColumn',
            'template' => '{view_book}',
            'header' => 'View Article',
            'buttons' => [
                'view_book' => function ($slug, $model) {
                    return Html::a('<i class="glyphicon glyphicon-eye-open"></i>', $slug, ['class' => 'btn btn-view'], [
                                'title' => Yii::t('app', 'View book'),
                    ]);
                }
            ],
            'urlCreator' => function ($action, $model, $key, $index) {
                if ($action === 'view_book') {
                    $url = Yii::$app->urlManager->createUrl(array('article/' . $model->slug));
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
        'filterModel' => $searchModel,
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
