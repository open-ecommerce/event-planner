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

/* @var $this yii\web\View */
/* @var $searchModel app\models\CustomersSearch */
/* @var $dataProvider yii\data\ActiveDataProvider 
 */

//$advancedForm = $this->render('_search', array('model' => $searchModel));


$this->title = "  List of Tickets";
?>

<div id="book-index-desktop" class="col-md-12">
    <?php //echo $this->render('_search', ['model' => $searchModel]);    ?>
    <?php
    
    $headerBar = $this->render('_search-global', array('model' => $searchModel));
    
    echo $headerBar;
    
    //echo Html::button('Advanced Search <i class="glyphicon glyphicon-chevron-down"></i>', ['type' => 'button', 'title' => Yii::t('kvgrid', 'Add Book'), 'class' => 'btn btn-success', 'id' => 'extended-search-lnk']);

    $gridColumns = [
        [
            'attribute' => 'favourite',
            'label' => 'Fav.',
            'vAlign' => 'middle',
            'value' => 'favoritedIcon',
            'hAlign' => 'center',
            'vAlign' => 'middle',
            'format' => 'raw',
            'width' => '30px',            
            'filterType' => GridView::FILTER_CHECKBOX_X,
            'filterWidgetOptions' => [
                'pluginOptions' => [
                    'threeState' => false,
                    'size' => 'lg',
                    'iconChecked' => '<i class="glyphicon glyphicon-asterisk"></i>',                    
                    'iconUnchecked' => '',
                    'inline' => true,
                    ],
            ],
        ],
        [
            'attribute' => 'title',
            'vAlign' => 'middle',
            'vAlign' => 'middle',
            'width' => '180px',
            'value' => function ($model, $key, $index, $widget) {
                return Html::a($model->title, '/book/' . $model->slug, ['title' => 'View book', 'target' => '_blank', 'alt' => 'Link to Frontend',]);
            },
            'format' => 'raw'
        ],
        [
            'attribute' => 'author_id',
            'value' => 'author.name',
            'width' => '100px',
            'hAlign' => 'left',
            'vAlign' => 'middle',
            'filterType' => GridView::FILTER_SELECT2,
            //'filter' => ArrayHelper::map(Author::find()->orderBy('name')->asArray()->all(), 'id', 'name'),
            'filter' => ArrayHelper::map(BookIndex::find()->joinWith(['author'])->select(['author.id', 'author.name'])->distinct()->orderBy('name')->all(), 'id', 'name'),
            'filterWidgetOptions' => [
                'pluginOptions' => ['allowClear' => true],
            ],
            'filterInputOptions' => ['placeholder' => 'Any Author'],
            'format' => 'raw'
        ],
        [
            'attribute' => 'category_id',
            //'value' => 'category.name',
            'value' => 'allCategories',            
            'label' => 'Category',
            'hAlign' => 'left',
            'vAlign' => 'middle',
            'width' => '300px',
            'filterType' => GridView::FILTER_SELECT2,
            'filter' => BookCategoryTree::allCategories(),
            //'filter' => ArrayHelper::map(BookCategoryTree::find()->select('*')->where('active')->orderBy('root')->asArray()->all(), 'root','id','name'),
            'filterWidgetOptions' => [
                'pluginOptions' => ['allowClear' => true],
            ],
            'filterInputOptions' => ['placeholder' => 'Any Category'],
            'format' => 'raw'
        ],
        [
            'attribute' => 'report_by',
            'label' => 'Reader',
            'value' => 'reportFullname',
            'hAlign' => 'left',
            'vAlign' => 'middle',
            'filterType' => GridView::FILTER_SELECT2,
            'filter' => ArrayHelper::map(UserProfile::find()->asArray()->all(), 'user_id', function($model, $defaultValue) {
                        return $model['firstname'] . ' ' . $model['lastname'];
                    }
            ),
            'filterWidgetOptions' => [
                'pluginOptions' => ['allowClear' => true],
            ],
            'filterInputOptions' => ['placeholder' => 'Any User'],
            'format' => 'raw'
        ],                   
//        [
//            'attribute' => 'updated_at',
//            'format' => 'datetime',
//            'filterType' => GridView::FILTER_DATE_RANGE,
//            'filterWidgetOptions' => ([
//                'attribute' => 'updated_at',
//                'presetDropdown' => true,
//                'convertFormat' => false,
//                'pluginOptions' => [
//                    'separator' => 'to',
//                    'format' => 'DD MMM YYYY',
//                    'locale' => [
//                        'format' => 'DD MMM YYYY'
//                    ],
//        ],
//        'pluginEvents' => [
//            "apply.daterangepicker" => "function() { apply_filter('only_date') }",
//        ],
//            ])
//        ],
        [
            'attribute' => 'publisher_id',
            'value' => 'publisher.name',
            'hAlign' => 'left',
            'vAlign' => 'middle',
            'width' => '180px',
            'filterType' => GridView::FILTER_SELECT2,
            //'filter' => ArrayHelper::map(Contact::find()->orderBy('name')->asArray()->all(), 'id', 'name'),
            'filter' => ArrayHelper::map(BookIndex::find()->joinWith(['publisher'])->select(['contact.id', 'contact.name'])->distinct()->orderBy('name')->all(), 'id', 'name'),
            'filterWidgetOptions' => [
                'pluginOptions' => ['allowClear' => true],
            ],
            'filterInputOptions' => ['placeholder' => 'Any Owner'],
            'format' => 'raw'
        ],
        [
            'attribute' => 'rights_owner_id',
            'value' => 'rightsOwner.name',
            'hAlign' => 'left',
            'vAlign' => 'middle',
            'width' => '180px',
            'filterType' => GridView::FILTER_SELECT2,
            //'filter' => ArrayHelper::map(Contact::find()->orderBy('name')->asArray()->all(), 'id', 'name'),
            'filter' => ArrayHelper::map(BookIndex::find()->joinWith(['rightsOwner'])->select(['contact.id', 'contact.name'])->distinct()->orderBy('name')->all(), 'id', 'name'),
            'filterWidgetOptions' => [
                'pluginOptions' => ['allowClear' => true],
            ],
            'filterInputOptions' => ['placeholder' => 'Any Owner'],
            'format' => 'raw'
        ],
        [
            'attribute' => 'country_id',
            'value' => 'country.country_name',
            'hAlign' => 'left',
            'vAlign' => 'middle',
            'filterType' => GridView::FILTER_SELECT2,
            'filter' => ArrayHelper::map(BookIndex::find()->joinWith(['country'])->select(['country.id', 'country.country_name'])->distinct()->orderBy('country_name')->all(), 'id', 'country_name'),
            'filterWidgetOptions' => [
                'pluginOptions' => ['allowClear' => true],
            ],
            'filterInputOptions' => ['placeholder' => 'Any Country'],
            'format' => 'raw'
        ],
        [
            'class' => 'kartik\grid\ActionColumn',
            'template' => '{edit_book}',
            'visible' => (Yii::$app->user->can("administrator")),
            'header' => 'Edit',
            'buttons' => [
                'edit_book' => function ($url, $model) {
                    return Html::a('<i class="glyphicon glyphicon-pencil"></i>', $url, ['target' => '_blank', 'data-pjax' => "0", 'class' => 'btn btn-edit', 'title' => Yii::t('app', 'Edit Book'),
                    ]);
                }
            ],
            'urlCreator' => function ($action, $model, $key, $index) {
                if ($action === 'edit_book') {
                    $url = Yii::$app->urlManager->createUrl(array('/admin/book/update?id=' . $model->id));
                    return $url;
                }
            }
        ],
        [
            'class' => 'kartik\grid\ActionColumn',
            'template' => '{view_book}',
            'header' => 'View',
            'buttons' => [
                'view_book' => function ($url, $model) {
                    return Html::a('<i class="glyphicon glyphicon-eye-open"></i>', $url, ['class' => 'btn btn-view', 'target' => '_blank'], [
                                'title' => Yii::t('app', 'View book'),
                    ]);
                }
            ],
            'urlCreator' => function ($action, $model, $key, $index) {
                if ($action === 'view_book') {
                    $url = Yii::$app->urlManager->createUrl(array('book/' . $model->slug));
                    return $url;
                }
            }
        ],
    ];
?>


    <?=
    GridView::widget([
        'id' => 'grid-cases',
        'dataProvider' => $dataProvider,
        'filterModel' => $searchModel,
        'resizableColumns' => true,
        'showPageSummary' => false,
        //'afterHeader' => $advancedForm,
        //'afterHeader' => $headerBar,
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
            'type' => 'primary books',
            'showFooter' => false,
            ['content' => $headerBar],
//            ['content' =>
//                Html::button('Global Search <i class="glyphicon glyphicon-chevron-down"></i>', ['type' => 'button', 'title' => Yii::t('kvgrid', 'Add Book'), 'class' => 'btn btn-success', 'id' => 'extended-search-lnk'])
//            ],
        ],
        'columns' => $gridColumns,
        // set your toolbar
        'toolbar' => [
        //'{export}',
        ],
    ]);
    ?>

</div>

<?php
//$this->registerJs("
//    $('#extended-search-lnk').on('click', function(e){
//        e.preventDefault();
//        $('#extended-search').toggle();
//        if($( '#extended-search' ).is( ':visible' )){
//            $('#extended-search-lnk i').addClass('glyphicon-chevron-up');
//            $('#extended-search-lnk i').removeClass('glyphicon-chevron-down');
//        }else{
//            $('#extended-search-lnk i').addClass('glyphicon-chevron-down');
//            $('#extended-search-lnk i').removeClass('glyphicon-chevron-up');
//        }                       
//    })    
//");
?>
