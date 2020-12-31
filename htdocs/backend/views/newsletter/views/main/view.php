<?php

use yii\helpers\Html;
use yii\widgets\DetailView;

/* @var $this yii\web\View */
/* @var $model app\models\Equeue */

$this->title = $model->id;
$this->params['breadcrumbs'][] = ['label' => 'Equeues', 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="main-view">

    <h3><?= Html::encode($this->title) ?></h3>

    <p>
        <?= Html::a('Update', ['update', 'id' => $model->id], ['class' => 'btn btn-primary']) ?>
        <?= Html::a('Delete', ['delete', 'id' => $model->id], [
            'class' => 'btn btn-danger',
            'data' => [
                'confirm' => 'Are you sure you want to delete this item?',
                'method' => 'post',
            ],
        ]) ?>
    </p>

    <?= DetailView::widget([
        'model' => $model,
        'attributes' => [
            'id',
            'from:ntext',
            'to:ntext',
            'cc:ntext',
            'bcc:ntext',
            'subject',
            'html_body:ntext',
            'text_body:ntext',
            'attachment:ntext',
            'reply_to:ntext',
            'charset',
            'created_at',
            'attempts',
            'last_attempt_time',
            'sent_time',
        ],
    ]) ?>

</div>
