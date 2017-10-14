<?php

//cases 

use kartik\daterange\DateRangePicker;
use yii\helpers\Html;
use kartik\grid\GridView;
use yii\helpers\Url;
use common\models\UserProfile;
use common\models\User;
use yii\helpers\ArrayHelper;
use common\models\TicketType;
use common\models\Ticket;
use common\grid\EnumColumn;

/* @var $this yii\web\View */
/* @var $searchModel app\models\CustomersSearch */
/* @var $dataProvider yii\data\ActiveDataProvider 
 */

$deleteTip = "Delete this client detail and all the attendances records.";
$deleteMsg = "Are you sure you want to delete this client detail and all the attendances records?";


$this->title = "  List of Tickets";
?>

<div id="book-index-desktop" class="col-md-12">
    <?php //echo $this->render('_search', ['model' => $searchModel]);     ?>
    <?php
    $headerBar = $this->render('_search-barcode', array('model' => $searchModel));

    echo $headerBar;

    //echo Html::button('Advanced Search <i class="glyphicon glyphicon-chevron-down"></i>', ['type' => 'button', 'title' => Yii::t('kvgrid', 'Add Book'), 'class' => 'btn btn-success', 'id' => 'extended-search-lnk']);

    $gridColumns = [
        [
            'attribute' => 'id',
            'width' => '5px',
        ],        
        [
            'class' => 'kartik\grid\ExpandRowColumn',
            'value' => function ($model, $key, $index, $column) {
                return GridView::ROW_COLLAPSED;
            },
            'detailUrl' => Url::to(['ticket/detail']),
            'detailRowCssClass' => GridView::TYPE_DEFAULT,
            'pageSummary' => false,
        ],
        [
            'width' => '10px',
            'attribute' => 'Picture',
            'format' => 'raw',
            'value' => function($model, $key ) {
                return ($model->avatar) ? Html::a(Html::img($model->avatar, ['width' => '100', 'class' => 'img-circle']), '/ticket/update?id=' . $key, ['alt' => '_blank']) : false;
            },
        ],
        [
            'class' => 'kartik\grid\EditableColumn',
            'attribute' => 'barcode',
            'editableOptions' => [
                'header' => 'Barcode',
            ],
            'hAlign' => 'left',
            'vAlign' => 'middle',
            'width' => '10px',
            'filter' => '',
        ],
        [
            'attribute' => 'ticket_type_id',
            'value' => 'ticketType.ticket_name',
            'label' => 'Ticket Type',
            'hAlign' => 'left',
            'vAlign' => 'middle',
            'width' => '200px',
            'filterType' => GridView::FILTER_SELECT2,
            //'filter' => ArrayHelper::map(Contact::find()->orderBy('name')->asArray()->all(), 'id', 'name'),
            'filter' => ArrayHelper::map(Ticket::find()->joinWith(['ticketType'])->select(['ticket_type.id', 'ticket_type.ticket_name'])->distinct()->orderBy('ticket_name')->all(), 'id', 'ticket_name'),
            'filterWidgetOptions' => [
                'pluginOptions' => ['allowClear' => true],
            ],
            'filterInputOptions' => ['placeholder' => 'Any Ticket'],
            'format' => 'raw'
        ],
        [
            'attribute' => 'last_name',
            'vAlign' => 'middle',
            'vAlign' => 'middle',
            'width' => '50px',
            'value' => function ($model, $key, $index, $widget) {
                return Html::a($model->last_name, '/ticket/' . $model->id, ['title' => 'View ticket', 'target' => '_blank', 'alt' => 'Link to View',]);
            },
            'format' => 'raw'
        ],
        [
            'attribute' => 'first_name',
            'vAlign' => 'middle',
            'vAlign' => 'middle',
            'width' => '50px',
            'value' => function ($model, $key, $index, $widget) {
                return Html::a($model->first_name, '/ticket/' . $model->id, ['title' => 'View ticket', 'target' => '_blank', 'alt' => 'Link to View',]);
            },
            'format' => 'raw'
        ],
        [
            'class' => 'kartik\grid\ActionColumn',
            'template' => '{edit_book}',
            'visible' => (Yii::$app->user->can("administrator")),
            'header' => 'Edit',
            'buttons' => [
                'edit_book' => function ($url, $model) {
                    return Html::a('<i class="glyphicon glyphicon-pencil"></i>', $url, ['target' => '_blank', 'data-pjax' => "0", 'class' => 'btn btn-edit', 'title' => Yii::t('app', 'Edit Ticket'),
                    ]);
                }
            ],
            'urlCreator' => function ($action, $model, $key, $index) {
                if ($action === 'edit_book') {
                    $url = Yii::$app->urlManager->createUrl(array('/ticket/update?id=' . $model->id));
                    return $url;
                }
            }
        ],
        [
            'class' => 'kartik\grid\ActionColumn',
            'header' => 'Delete',
            'template' => '{delete}',
            'deleteOptions' => ['label' => '<i class="glyphicon glyphicon-trash"></i>'],
            'deleteOptions' => ['title' => $deleteTip, 'data-toggle' => 'tooltip', 'data-confirm' => $deleteMsg],
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
            'heading' => '',
            'type' => 'primary books',
            'showFooter' => false,
            ['content' => $headerBar],
//            ['content' =>
//                Html::button('Global Search <i class="glyphicon glyphicon-chevron-down"></i>', ['type' => 'button', 'title' => Yii::t('kvgrid', 'Add Book'), 'class' => 'btn btn-success', 'id' => 'extended-search-lnk'])
//            ],
        ],
        'columns' => $gridColumns,
        // set export properties
        'export' => [
            'fontAwesome' => true
        ],
        // set your toolbar
        'toolbar' => [
            ['content' =>
                Html::a('<i class="glyphicon glyphicon-plus"></i>  Create new Ticket', ['create'], ['class' => 'btn btn-success']),
            ],
            '{export}',
        ],]);
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
$this->registerJs("
window.onload = function() {
  var input = document.getElementById('ticketsearch-barcodesearch').focus();
  $('#ticketsearch-barcodesearch').attr('value', '');  
}
");
?>
