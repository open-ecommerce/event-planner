<?php

use yii\bootstrap\Nav;
use yii\bootstrap\NavBar;

/* @var $this \yii\web\View */
/* @var $content string */

$this->beginContent('@frontend/views/layouts/_clear.php')
?>


<div class="wrap guest login">
<?php
if (Yii::$app->controller->action->id == 'index') {
    NavBar::begin([
        'brandUrl' => '',
        'options' => [
            'class' => 'navbar guest login',
            'id' => 'main-menu',
        ],
    ]);
} else {
    NavBar::begin([
        'brandLabel' => '',
        'brandUrl' => null,
        'options' => [
            'class' => 'navbar guest login',
            'id' => 'main-menu',
        ],
    ]);
}
?>
    <?php
    echo Nav::widget([
        'options' => ['class' => 'navbar-nav navbar-right guest login'],
        'items' => [
            ['label' => Yii::t('frontend', 'About us'), 'url' => ['/site/about-guest', 'slug' => 'about-guest']],
            ['label' => Yii::t('frontend', 'Sign in'), 'url' => ['/user/sign-in/login'], 'visible' => Yii::$app->user->isGuest],
        ]
    ]);
    ?>
    <?php NavBar::end(); ?>

    <?php echo $content ?>

</div>


<?php
    $this->beginContent('@frontend/views/layouts/_footer_guest.php');
    $this->endContent();
?>





<?php $this->endContent() ?>
