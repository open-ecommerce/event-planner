<?php

use yii\bootstrap\Nav;
use yii\bootstrap\NavBar;

/* @var $this \yii\web\View */
/* @var $content string */

$this->beginContent('@frontend/views/layouts/_clear.php')
?>


<div class="wrap">
    <?php
    NavBar::begin([
        'brandLabel' => '<img src="/dist/img/generic/uktango-logo-s.jpg" class="pull-left"/>',
        'brandUrl' => Yii::$app->homeUrl,
        'options' => [
            'class' => 'navbar navbar-fixed-top clients',
            'id' => 'main-menu',
        ],
    ]);
    echo Nav::widget([
        'options' => ['class' => 'navbar-nav navbar-right'],
        'items' => [
            ['label' => Yii::t('frontend', 'Ticket Check-In'), 'url' => ['/ticket/index'], 'visible' => !Yii::$app->user->isGuest],
            ['label' => Yii::t('frontend', 'Bookmarks'), 'url' => ['/bookmark/index'], 'visible' => !Yii::$app->user->isGuest],
            ['label' => Yii::t('frontend', 'About us'), 'url' => ['/site/about', 'slug' => 'about']],
            ['label' => Yii::t('frontend', 'Login'), 'url' => ['/user/sign-in/login'], 'visible' => Yii::$app->user->isGuest],
            ['label' => Yii::$app->user->isGuest ? '' : 'Hi '.Yii::$app->user->identity->getFirstname(),
                'visible' => !Yii::$app->user->isGuest,
                'items' => [
                    [
                        'label' => Yii::t('frontend', 'Your Account'),
                        'url' => ['/user/default/view']
                    ],
                    [
                        'label' => Yii::t('frontend', 'Administration'),
                        'url' => Yii::getAlias('@backendUrl' . '/book/index'),
                        'linkOptions' => ['target' => '_blank'],
                        'visible' => Yii::$app->user->can('manager')
                    ],
                    [
                        'label' => Yii::t('frontend', 'Help'),
                        'url' => 'http://help.londonliteraryscouting.com',
                        'visible' => Yii::$app->user->can('manager')
                    ],
                    [
                        'label' => Yii::t('frontend', 'Logout'),
                        'url' => ['/user/sign-in/logout'],
                        'linkOptions' => ['data-method' => 'post']
                    ]
                ]
            ],
        ]
    ]);
    ?>
    <?php NavBar::end(); ?>

    <?php echo $content ?>

</div>


<?php
$this->beginContent('@frontend/views/layouts/_footer.php');
$this->endContent();
?>





<?php $this->endContent() ?>
