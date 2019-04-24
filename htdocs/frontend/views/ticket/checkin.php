<?php

//cases 

use kartik\daterange\DateRangePicker;
use yii\helpers\Html;
use kartik\grid\GridView;
use kartik\editable\Editable;
use yii\helpers\Url;
use common\models\UserProfile;
use common\models\User;
use yii\helpers\ArrayHelper;
use common\models\TicketType;
use common\models\Ticket;
use common\grid\EnumColumn;
use kartik\form\ActiveForm;

/* @var $this yii\web\View */
/* @var $searchModel app\models\CustomersSearch */
/* @var $dataProvider yii\data\ActiveDataProvider
 */


$this->title = "  Check-In - Entering the venue";
?>

    <div id="checkin-attendance-desktop" class="col-md-12 <?php echo $problem ?>">
        <div class="row checkin-header">
        <div id="barcode-search" class="col-md-4 checkin">
            <?php
            $form = ActiveForm::begin([
                'action' => ['checkin'],
                'method' => 'get',
            ]);
            echo $form->field($searchModel, 'barcodeSearch', [
                'addon' => [
                    'prepend' => [
                        'content' => '<i class="glyphicon glyphicon-credit-card"></i>'
                    ],
                    'append' => [
                        'content' => Html::submitButton(Yii::t('backend', '<i class="glyphicon glyphicon-log-in"></i>'), ['class' => 'btn btn-view']),
                        'asButton' => true
                    ]
                ]
            ])->textInput()->input('barcodeSearch', ['placeholder' => "Check In"])->label(false);

            ?>

            <?php ActiveForm::end(); ?>
            <div id="current-day">Event day: <?php echo Yii::$app->keyStorage->get('frontend.current-day') ?> <?= Html::a('(change in settings)', ['/admin/key-storage/update?id=frontend.current-day']) ?></div>

        </div>
        <div class="col-md-8">
            <h3><?php echo $whereIs ?></h3><br>
        </div>
        </div>

        <?php if (!empty($dataProvider)) : ?>

            <?php

            $gridColumns = [
                [
                    'attribute' => 'id',
                    'width' => '5px',
                ],
                [
                    'class' => 'kartik\grid\ExpandRowColumn',
                    'value' => function ($model, $key, $index, $column) {
                        return GridView::ROW_EXPANDED;
                    },
                    'detailUrl' => Url::to(['ticket/detailtoday']),
                    'detailRowCssClass' => GridView::TYPE_DEFAULT,
                    'pageSummary' => false,
                ],
                [
                    'width' => '10px',
                    'attribute' => 'Picture',
                    'format' => 'raw',
                    'value' => function ($model, $key) {
                        return ($model->avatar) ? Html::a(Html::img($model->avatar, ['width' => '100', 'class' => 'img-circle']), '/ticket/view?id=' . $key, ['alt' => '_blank']) : false;
                    },
                ],
                [
                    'attribute' => 'barcode',
                    'hAlign' => 'left',
                    'vAlign' => 'middle',
                    'width' => '10px',
                    'filter' => '',
                ],
                [
                    'attribute' => 'ticket_status',
                    'label' => 'Status',
                    'hAlign' => 'left',
                    'vAlign' => 'middle',
                    'width' => '50px',
                    'format' => 'raw',

                ],
                [
                    'attribute' => 'ticket_type_id',
                    'value' => 'ticketType.ticket_name',
                    'label' => 'Ticket Type',
                    'hAlign' => 'left',
                    'vAlign' => 'middle',
                    'width' => '200px',
                    'filterType' => GridView::FILTER_SELECT2,
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
                    'header' => 'View',
                    'buttons' => [
                        'edit_book' => function ($url, $model) {
                            return Html::a('<i class="glyphicon glyphicon-user"></i>', $url, ['target' => '_blank', 'data-pjax' => "0", 'class' => 'btn btn-edit', 'title' => Yii::t('app', 'Edit Ticket'),
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
            ];
            ?>


            <?=
            GridView::widget([
                'id' => 'grid-cases',
                'dataProvider' => $dataProvider,
//        'filterModel' => $searchModel,
                'resizableColumns' => true,
                'showPageSummary' => false,
                'headerRowOptions' => ['class' => 'kartik-sheet-style'],
                'filterRowOptions' => ['class' => 'kartik-sheet-style'],
                'responsive' => true,
                'pjax' => true, // pjax is set to always true for this demo
                'pjaxSettings' => [
                    'neverTimeout' => true,
                ],
                'hover' => true,
                'columns' => $gridColumns,
                // set export properties
                'export' => [
                    'fontAwesome' => true
                ],
                // set your toolbar
            ]);
            ?>

        <?php endif; ?>
    </div>


<?php
$this->registerJs("
window.onload = function() {
  var input = document.getElementById('ticketsearch-barcodesearch').focus();
  $('#ticketsearch-barcodesearch').attr('value', '');  
}
");
?>