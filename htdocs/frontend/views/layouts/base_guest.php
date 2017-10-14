<?php

use yii\bootstrap\Nav;
use yii\bootstrap\NavBar;

/* @var $this \yii\web\View */
/* @var $content string */

$this->beginContent('@frontend/views/layouts/_clear.php')
?>

<div class="wrap guest">
<?php
if (Yii::$app->controller->action->id == 'index') {
    NavBar::begin([
       'brandUrl' => Yii::$app->homeUrl,
        'options' => [
            'class' => 'navbar hide-small-logo',
            'id' => 'main-menu',
        ],
    ]);
} else {
    NavBar::begin([
        'brandLabel' => '<img id="logo-aboutus" src="/dist/img/generic/uk-tango-festival.png" class="pull-left"/>',
        'brandUrl' => null,
        'options' => [
            'class' => 'navbar hide-small-logo noindex',
            'id' => 'main-menu',
        ],
    ]);
}
?>
    <?php
    echo Nav::widget([
        'options' => ['class' => 'navbar-nav navbar-right guest'],
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
if (Yii::$app->user->isGuest) {
    $this->beginContent('@frontend/views/layouts/_footer_guest.php');
} else {
    $this->beginContent('@frontend/views/layouts/_footer_guest.php');
}
$this->endContent();
?>





<?php $this->endContent() ?>
