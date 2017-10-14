<?php
/* @var $this \yii\web\View */

use yii\helpers\ArrayHelper;
use yii\widgets\Breadcrumbs;
use common\components\topToolbar\topToolbar;
use kartik\widgets\Growl;
use yii\helpers\Html;
use yii\helpers\Url;

/* @var $content string */

$this->beginContent('@frontend/modules/user/views/layouts/base_guest.php')
?>
<div class="container main-content login">
    
    <?php if (Yii::$app->session->hasFlash('alert')): ?>
    <?php
    echo \yii\bootstrap\Alert::widget([
        'body' => ArrayHelper::getValue(Yii::$app->session->getFlash('alert'), 'body'),
        'options' => ArrayHelper::getValue(Yii::$app->session->getFlash('alert'), 'options'),
    ])
    ?>
    <?php endif; ?>


<?php echo $content ?>

</div>
<?php $this->endContent() ?>
