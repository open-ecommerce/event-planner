<?php
/* @var $this \yii\web\View */

use yii\helpers\ArrayHelper;
use yii\widgets\Breadcrumbs;
use common\components\topToolbar\topToolbar;
use kartik\widgets\Growl;
use yii\helpers\Html;
use yii\helpers\Url;

/* @var $content string */

$this->beginContent('@frontend/views/layouts/base_guest.php')
?>
<div class="container main-content main-guest">
    
    <div id="top-toolbar" class="row">
        <div class="col-md-6">
            <?=
            Breadcrumbs::widget([
                'links' => isset($this->params['breadcrumbs']) ? $this->params['breadcrumbs'] : [],
            ])
            ?>
        </div>
        <div class="col-md-offset-3-">
            <?=
            topToolbar::widget([
                'links' => isset($this->params['toptoolbar']) ? $this->params['toptoolbar'] : [],
            ])
            ?>       
        </div>
    </div>        


    <?php if (Yii::$app->session->hasFlash('alert')): ?>
    <?php
    echo \yii\bootstrap\Alert::widget([
        'body' => ArrayHelper::getValue(Yii::$app->session->getFlash('alert'), 'body'),
        'options' => ArrayHelper::getValue(Yii::$app->session->getFlash('alert'), 'options'),
    ])
    ?>
    <?php endif; ?>

    <!-- Example of your ads placing -->
<?php
echo \common\widgets\DbText::widget([
    'key' => 'ads-example'
])
?>

<?php echo $content ?>

</div>
<?php $this->endContent() ?>
