<?php

use yii\helpers\Html;


/* @var $this yii\web\View */
/* @var $model common\models\Ticket */

$this->title = Yii::t('common', 'Create {modelClass}', [
    'modelClass' => 'Ticket',
]);
$this->params['breadcrumbs'][] = ['label' => Yii::t('common', 'Tickets'), 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="ticket-create">

    <?php echo $this->render('_form', [
        'model' => $model,
        'ticketType' => $ticketType,
    ]) ?>

</div>
