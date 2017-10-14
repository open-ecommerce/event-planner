<?php

use yii\helpers\Html;
use kartik\grid\GridView;


/* @var $this yii\web\View */
/* @var $searchModel app\models\AttendanceSearch */
/* @var $dataProvider yii\data\ActiveDataProvider */


$deleteTip = "Delete this Ticket attendances records.";
$deleteMsg = "Are you sure you want to delete this client ticket detail?";

?>


<div class="customers-attendance-list">
    <?php
    $gridColumns = [ 
        [
            'attribute' => 'venue.name',
            'hAlign' => 'center',
            'vAlign' => 'middle',
            'width' => '30px',            
        ],
        [
            'attribute' => 'attendance',
            'format' => ['date', 'php:d M y - G:i:s'],
            'hAlign' => 'center',
            'vAlign' => 'middle',
            'width' => '30px',            
        ],
        [
            'class' => 'kartik\grid\ActionColumn',
            'header' => 'Delete',
            'template' => '{delete}',
            'deleteOptions' => ['label' => '<i class="glyphicon glyphicon-trash"></i>'],
            'deleteOptions' => ['title' => $deleteTip, 'data-toggle' => 'tooltip', 'data-confirm' => $deleteMsg],
        ],        
        
        
//        [
//            'class' => 'kartik\grid\ActionColumn',
//        ],
    ];
    ?>

    <?=
    GridView::widget([
        'dataProvider' => $dataProvider,
        'responsive' => true,
        'resizableColumns' => false,
        'headerRowOptions' => ['class' => 'kartik-sheet-style'],
        'pjax' => true, // pjax is set to always true for this demo
        'hover' => true,
        'toolbar' => false,
//        'panel' => [
//            'heading' => '<h3 class="panel-title"><i class="glyphicon glyphicon-book"></i> Previous visits</h3>',
//            'type' => 'info',
//            'footer' => false,
//        ],
        'panel' => false,
        'columns' => $gridColumns,
    ]);
    ?>


</div>
