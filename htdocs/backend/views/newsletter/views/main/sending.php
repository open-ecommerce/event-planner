<?php

use yii\helpers\Html;
use kartik\grid\GridView;
use yii\web\View;
use yii\widgets\Pjax;
use yii\helpers\Url;

/* @var $this yii\web\View */
/* @var $searchModel app\models\EqueueSearch */
/* @var $dataProvider yii\data\ActiveDataProvider */

$this->title = 'Sending';
$this->params['breadcrumbs'][] = $this->title;
?>
<?php
$Css_script = <<< CSS
.inform{
        color:#01699C;
    }
.successful{
        color:#3c763d;
    }
.rotate{
    font-size: 30px;
}
.fa-spin-custom, .glyphicon-spin {
    -webkit-animation: spin 1000ms infinite linear;
    animation: spin 1000ms infinite linear;
}
@-webkit-keyframes spin {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(359deg);
        transform: rotate(359deg);
    }
}
@keyframes spin {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(359deg);
        transform: rotate(359deg);
    }
} 

CSS;
$this->registerCss($Css_script);
?>
<div class="main-index" style="">
    <div class="box box-info">
        <div class="box-header" style="border-bottom: 1px solid #00c0ef">
            <i class="fa fa-envelope" style="padding: 10px 0px 10px 10px;"></i>
            <h3 class="box-title"> 
                All emails
            </h3>
        </div>
<?= Html::beginForm(['bulk'], 'post'); ?>

        <div style="margin: 10px;">
            <div>
                <a href="<?= Yii::$app->request->baseurl ?>/newsletter/main/mailcreate" class="btn btn-default btn-md">Compose Mail</a>
                <?php
//                    echo Html::a('Sending', ['#'], [
//                        'class' => 'btn btn-primary',
//                        'id' => 'btn_init_newsletters_sending',
//                    ])
                ?>
                <?= Html::a('Clear', ['#'], [
                    'class' => 'btn btn-danger',
                    'data-toggle' => "tooltip",
                    'data-placement' => "top",
                    'title' => 'Delete old newsletters',
                    'id' => 'btn_delete_old_newsletters',

                ]) ?>
                <input type="button" class="btn btn-info" value="Delete Selected Mails" id="delete_btn" >
            </div>

            <?php Pjax::begin(['id' => 'sending-mail']); ?>
            <?=
            GridView::widget([
                'dataProvider' => $dataProvider,
                'filterModel' => $searchModel,
                'containerOptions' => ['id' => 'emails-pjax-container'],    
                'id' => 'emailGrid',
                'columns' => [
                    ['class' => '\kartik\grid\CheckboxColumn'],
                    ['class' => 'yii\grid\SerialColumn'],
                    'mail_id',
                    'subject',
                    'to',
                    'cc',
                    'bcc',
                    'created_date',
                    [
                        'attribute' => 'status',
                        'filter' => Html::activeDropDownList($searchModel, 'status', ['Queue' => 'Queue', 'Sent' => 'Sent'], ['class' => 'form-control', 'prompt' => 'Select Status']),
                    ],
                    [
                        'class' => 'yii\grid\ActionColumn',
                        'template' => '{delete}'
                    ]
                ],
            ]);
            ?>
            <?php Pjax::end(); ?>  
            <?= Html::endForm(); ?>
        </div>
    </div>
</div>
<?php $this->registerJsFile('/admin/js/newsletter.js', ['position' => View::POS_END, 'depends' => [yii\web\JqueryAsset::className()]]) ?>
<?php
$this->registerJs('var linkInitSending = "' . Url::to(['/newsletter/main/init-sending']) . '";', View::POS_HEAD);
$this->registerJs('var linkDeleteOldNewsletters = "' . Url::to(['/newsletter/main/delete-old']) . '";', View::POS_HEAD);

$url = Url::to(['delete-multiple']);
$this->registerJs('
     $(document).on("click", "#delete_btn",function(event){
     event.preventDefault();
        var ids = $(\'#emailGrid\').yiiGridView(\'getSelectedRows\');
        var status = $(this).data(\'status\');
        if(ids.length > 0){
        if(confirm("Are You Sure To Delete Selected Mails !")){
              $.ajax({
                type: \'POST\',
                url :  \''.$url.'\' ,
                data : {ids: ids},
                dataType : \'JSON\',
                success: function (test) {
                    alert(test);
                    $.pjax.reload({container:\'#emailGrid-container\'});
                },
                error: function (exception) {
                    alert(exception);
                }                
            });
        }
        }else{
        alert(\'Please Select Record \');
}
    });
    ', \yii\web\View::POS_READY);
?>
 