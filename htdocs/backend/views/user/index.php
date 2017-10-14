<?php

use yii\helpers\Html;
use kartik\grid\GridView;
use yii\helpers\Url;
use yii\helpers\ArrayHelper;
use common\grid\EnumColumn;
use common\models\User;
use openecommerce\yiikartiktrivalent;
use common\models\Company;

/* @var $this yii\web\View */
/* @var $searchModel app\models\CustomersSearch */
/* @var $dataProvider yii\data\ActiveDataProvider */

$deleteTip = Yii::t('app', 'Delete this user.');
$deleteMsg = Yii::t('app', 'Are you sure you want to delete this User?');

$this->title = Yii::t('backend', 'Users');
$this->params['breadcrumbs'][] = $this->title;

$roles = [
    "user" => "user",
    "reader" => "reader",
    "administrator" => "adminstrator"
];


?>
<div class="books-index">
    <?php //echo $this->render('_search', ['model' => $searchModel]);    ?>
    <?php
//            'logged_at:datetime',    
    $gridColumns = [
        [
            'attribute' => 'id',
            'label' => '#',
            'width' => '30px',
            'hAlign' => 'center',
            'vAlign' => 'middle',
        ],
        [
            'attribute' => '',
            'format' => 'raw',
            'value' => function($model, $key ) {
                return ($model->avatar) ? Html::a(Html::img($model->avatar, ['width'=>'50','class' => 'img-circle']),'/admin/user/update?id=' . $key,['alt' => '_blank']) : false;
            },
        ],
        [
            'class' => EnumColumn::className(),
            'attribute' => 'status',
            'enum' => User::statuses(),
            'filter' => User::statuses()
        ],
        [
            'attribute' => 'username',
//            'value' => function ($model, $key, $index, $widget) {
//                return Html::a($model->username, '/admin/user/update?id=' . $key, ['username' => 'Update User', 'class' => 'title-update']);
//            },
            'format' => 'raw'
        ],
        [
            'attribute' => 'publicIdentity',
            'value' => function ($model, $key, $index, $widget) {
                return Html::a($model->publicIdentity, '/admin/user/update?id=' . $key, ['username' => 'Update User', 'class' => 'title-update']);
            },
            'format' => 'raw'
        ],
        [
            'attribute' => 'publishing_house_id',
            'value' => 'company.name',
            'label' => 'Company Name',
            'filterType' => GridView::FILTER_SELECT2,
            'filter' => ArrayHelper::map(Company::find()->orderBy('name')->asArray()->all(), 'id', 'name'),
            'filterWidgetOptions' => [
                'pluginOptions' => ['allowClear' => true],
            ],
            'filterInputOptions' => ['placeholder' => 'Any Company'],
            'format' => 'raw'
        ],
        [
            'label' => 'User Role',
            'attribute' => 'userRole',
            'value' => 'userRole',
            'filterType' => GridView::FILTER_SELECT2,
            'filter' => $roles,
            'filterWidgetOptions' => [
                'pluginOptions' => ['allowClear' => true],
            ],
            'filterInputOptions' => ['placeholder' => 'Any Role'],
            'format' => 'raw'
        ],
        [
            'attribute' => 'email',
            'format' => 'raw',
        ],
        'created_at:datetime',
        [
            'class' => 'kartik\grid\ActionColumn',
            'template' => '{edit_book}',
            'header' => 'URL',
            'buttons' => [
                'edit_book' => function ($url, $model) {

                    return \supplyhog\ClipboardJs\ClipboardJsWidget::widget([
                                'text' => '/user/default/view-by-others?id=' . $model->id,
                                'label' => 'Copy link',
                                'htmlOptions' => ['class' => 'btn'],
                                    // 'tag' => 'button',
                    ]);
                }
            ],
        ],
        [
            'class' => 'kartik\grid\ActionColumn',
            'header' => 'Update',
            'template' => '{update}',
            'viewOptions' => ['label' => '<i class="glyphicon glyphicon-pencil edit-today"></i>'],
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
    'dataProvider' => $dataProvider,
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
        'heading' => '<h3 class="panel-title"><i class="glyphicon glyphicon-group"></i> List of Users</h3>',
        'type' => 'primary',
        'showFooter' => false
    ],
    'columns' => $gridColumns,
    // set export properties
    'export' => [
        'fontAwesome' => true
    ],
    // set your toolbar
    'toolbar' => [
        ['content' =>
            Html::a('<i class="glyphicon glyphicon-plus"></i>  Create New User', ['create'], ['class' => 'btn btn-success']),
        ],
        '{export}',
    ],
]);
?>

</div>

