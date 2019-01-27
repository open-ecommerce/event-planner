<?php

//to do some work y desde aca tambien

use yii\jui\DatePicker;
use yii\helpers\Html;
//use yii\grid\GridView;
use kartik\grid\GridView;
use yii\helpers\Url;
use kartik\export\ExportMenu;


/* @var $this yii\web\View */
/* @var $searchModel app\models\StatisticsSearch */
/* @var $dataProvider yii\data\ActiveDataProvider */


$this->title = 'Total Tickets';
$this->params['breadcrumbs'][] = $this->title;
?>

<div class="queue-display container">
    <div class="col-md-8 col-md-offset-2">
        <div class="panel panel-default">
            <div class="panel-heading">
                <h3 class="panel-title">Total Statistics of Tickets</h3>
            </div>
            <div class="panel-body">
                <?php
                $gridColumns = [
                    [
                        'label' => 'Ticket Name',
                        'attribute' => 'ticket_name',
                        'value' => 'ticket_name',
                        'hAlign' => 'left',
                        'vAlign' => 'middle',
                        'width' => '300px',
                    ],
                    [
                        'attribute' => 'total',
                        'label' => 'Total Registered',
                        'hAlign' => 'center',
                        'vAlign' => 'middle',
                        'width' => '10px',
                    ],
                    [
                    'attribute' => 'role',
                    'label' => 'Role',
                    'hAlign' => 'center',
                    'vAlign' => 'middle',
                    'width' => '50px',
                ]
                ];


//                echo ExportMenu::widget([
//                    'dataProvider' => $dataProvider,
//                    'columns' => $gridColumns,
//                    'fontAwesome' => true,
//                    'showConfirmAlert'=>false,
//                    'target'=>GridView::TARGET_BLANK,
//                    'dropdownOptions' => [
//                        'label' => 'Export All',
//                        'class' => 'btn btn-default'
//                    ]
//                ])

                ?>



                <?=
                GridView::widget([
                    'dataProvider' => $dataProvider,
                    'resizableColumns' => false,
                    'summary' => false,
                    'showPageSummary' => false,
                    'headerRowOptions' => ['class' => 'kartik-sheet-style'],
                    //'filterRowOptions' => ['class' => 'kartik-sheet-style'],
                    'responsive' => true,
                    'pager' => false,
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
                    'toolbar' => [
                        '{export}',
                    ],
                ]);
                ?>

            </div>
        </div>
    </div>
</div>
