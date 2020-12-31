<?php

use yii\helpers\Html;
use yii\grid\GridView;
use yii\widgets\Pjax;

/* @var $this yii\web\View */
/* @var $searchModel app\models\EqueueSearch */
/* @var $dataProvider yii\data\ActiveDataProvider */

$this->title = 'Sent emails';
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="main-index">

    <h3><?= Html::encode($this->title) ?></h3>
    <?php // echo $this->render('_search', ['model' => $searchModel]); ?>

   
    <?php Pjax::begin();?>
    <?= GridView::widget([
        'dataProvider' => $dataProvider,
        'filterModel' => $searchModel,
        'id'=>'emailGrid',
        'columns' => [
            ['class' => 'yii\grid\SerialColumn'],

            //'id',
            //'from:ntext',
            [
               'attribute'=>'to',
                'value'=>  function ($model){
                     $data =unserialize($model->to);
                     if($data){
                       return key($data);  
                     }
                    else {
                        return ' ---';
                    }
                     
                   
                }
            ],
            [
               'attribute'=>'cc',
                'value'=>  function ($model){
                     $data =unserialize($model->cc);
                     if($data){
                       return key($data);  
                     } else {
                        return ' ---';
                    }
                   
                }
            ],
                    [
               'attribute'=>'bcc',
                'value'=>  function ($model){
                     $data =unserialize($model->bcc);
                     if($data){
                       return key($data);  
                     } else {
                        return ' ---';
                    }
                   
                }
            ],
           
            
           
            // 'subject',
            // 'html_body:ntext',
            'text_body:ntext',
            // 'attachment:ntext',
            // 'reply_to:ntext',
            // 'charset',
            'created_at',
                     [
               'attribute'=>'attempts',
                'value'=>  function ($model){
                     
                     if($model->attempts&&$model->sent_time){
                       return 'Success';  
                     }
                     elseif ((!$model->attempts)&&$model->sent_time) {
                     return 'Unsuccess'; 
                 }else {
                        return 'Not sent';
                    }
                   
                }
            ],
           
            // 'last_attempt_time',
            // 'sent_time',

            //['class' => 'yii\grid\ActionColumn'],
        ],
    ]); ?>
<?php Pjax::end();?>
</div>
<style>
    #emailGrid>table>thead>tr>th:first-child{
        color: rgba(0,0,0,0);
    }
    #emailGrid>table>thead>tr>th:first-child:before{
        content: "S.N.";
        color:#337ab7;
    }
</style>