<?php

/**
 * @var $this yii\web\View
 */
use backend\assets\BackendAsset;
use backend\widgets\Menu;
use common\models\TimelineEvent;
use yii\helpers\ArrayHelper;
use yii\helpers\Html;
use yii\helpers\Url;
use yii\widgets\Breadcrumbs;
use kartik\widgets\Growl;

$bundle = BackendAsset::register($this);

if (!empty(Yii::$app->user->identity->userProfile->avatar_path)) {
    $avatar = Yii::$app->user->identity->userProfile->avatar;
} else {
    //$avatar = "/dist/img/generic/no-cover.jpg";
    $avatar = "https://robohash.org/set_set1/" . Yii::$app->user->identity->userProfile->firstname . "?size=440x440";
}


?>
<?php $this->beginContent('@backend/views/layouts/base.php'); ?>
<div class="wrapper">
    <!-- header logo: style can be found in header.less -->
    <header class="main-header">
        <a href="<?php echo Yii::getAlias('@frontendUrl') ?>" class="logo">
            <!-- Add the class icon to your logo image or logo icon to add the margining -->
            <?php echo Yii::$app->name ?>
        </a>
        <!-- Header Navbar: style can be found in header.less -->
        <nav class="navbar navbar-static-top" role="navigation">
            <!-- Sidebar toggle button-->
            <a href="#" class="sidebar-toggle" data-toggle="offcanvas" role="button">
                <span class="sr-only"><?php echo Yii::t('backend', 'Toggle navigation') ?></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </a>
            <div class="navbar-custom-menu">
                <ul class="nav navbar-nav">
                    <li id="timeline-notifications" class="notifications-menu">
                        <a href="<?php echo Url::to(['/timeline-event/index']) ?>">
                            <i class="fa fa-bell"></i>
                            <span class="label label-success">
                                <?php echo TimelineEvent::find()->today()->count() ?>
                            </span>
                        </a>
                    </li>
                    <!-- Notifications: style can be found in dropdown.less -->
                    <li id="log-dropdown" class="dropdown notifications-menu">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                            <i class="fa fa-warning"></i>
                            <span class="label label-danger">
                                <?php echo \backend\models\SystemLog::find()->count() ?>
                            </span>
                        </a>
                        <ul class="dropdown-menu">
                            <li class="header"><?php echo Yii::t('backend', 'You have {num} log items', ['num' => \backend\models\SystemLog::find()->count()]) ?></li>
                            <li>
                                <!-- inner menu: contains the actual data -->
                                <ul class="menu">
                                    <?php foreach (\backend\models\SystemLog::find()->orderBy(['log_time' => SORT_DESC])->limit(5)->all() as $logEntry): ?>
                                        <li>
                                            <a href="<?php echo Yii::$app->urlManager->createUrl(['/log/view', 'id' => $logEntry->id]) ?>">
                                                <i class="fa fa-warning <?php echo $logEntry->level == \yii\log\Logger::LEVEL_ERROR ? 'text-red' : 'text-yellow' ?>"></i>
                                                <?php echo $logEntry->category ?>
                                            </a>
                                        </li>
                                    <?php endforeach; ?>
                                </ul>
                            </li>
                            <li class="footer">
                                <?php echo Html::a(Yii::t('backend', 'View all'), ['/log/index']) ?>
                            </li>
                        </ul>
                    </li>
                    <!-- User Account: style can be found in dropdown.less -->
                    <li class="dropdown user user-menu">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                            <img src="<?= $avatar ?>" class="user-image">
                            <span><?php echo Yii::$app->user->identity->username ?> <i class="caret"></i></span>
                        </a>
                        <ul class="dropdown-menu">
                            <!-- User image -->
                            <li class="user-header light-blue">
                                <img src="<?php echo Yii::$app->user->identity->userProfile->getAvatar($this->assetManager->getAssetUrl($bundle, 'img/anonymous.jpg')) ?>" class="img-circle" alt="User Image" />
                                <p>
                                    <?php echo Yii::$app->user->identity->username ?>
                                    <small>
                                        <?php echo Yii::t('backend', 'Member since {0, date, short}', Yii::$app->user->identity->created_at) ?>
                                    </small>
                            </li>
                            <!-- Menu Footer-->
                            <li class="user-footer">
                                <div class="pull-left">
                                    <?php echo Html::a(Yii::t('backend', 'Profile'), ['/sign-in/profile'], ['class' => 'btn btn-default btn-flat']) ?>
                                </div>
                                <div class="pull-left">
                                    <?php echo Html::a(Yii::t('backend', 'Account'), ['/sign-in/account'], ['class' => 'btn btn-default btn-flat']) ?>
                                </div>
                                <div class="pull-right">
                                    <?php echo Html::a(Yii::t('backend', 'Logout'), ['/sign-in/logout'], ['class' => 'btn btn-default btn-flat', 'data-method' => 'post']) ?>
                                </div>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <?php echo Html::a('<i class="fa fa-cogs"></i>', ['/site/settings']) ?>
                    </li>
                </ul>
            </div>
        </nav>
    </header>
    <!-- Left side column. contains the logo and sidebar -->
    <aside class="main-sidebar">
        <!-- sidebar: style can be found in sidebar.less -->
        <section class="sidebar">
            <!-- Sidebar user panel -->
            <div class="user-panel">
                <div class="pull-left image">
                    <img src="<?= $avatar ?>" class="img-circle" />
                </div>
                <div class="pull-left info">
                    <p><?php echo Yii::t('backend', 'Hello, {username}', ['username' => Yii::$app->user->identity->getPublicIdentity()]) ?></p>
                    <a href="<?php echo Url::to(['/sign-in/profile']) ?>">
                        <i class="fa fa-circle text-success"></i>
                        <?php echo Yii::$app->formatter->asDatetime(time()) ?>
                    </a>
                </div>
            </div>
            <!-- sidebar menu: : style can be found in sidebar.less -->
            <?php
            echo Menu::widget([
                'options' => ['class' => 'sidebar-menu'],
                'linkTemplate' => '<a href="{url}">{icon}<span>{label}</span>{right-icon}{badge}</a>',
                'submenuTemplate' => "\n<ul class=\"treeview-menu\">\n{items}\n</ul>\n",
                'activateParents' => true,
                'items' => [
                    [
                        'label' => Yii::t('backend', 'Main'),
                        'options' => ['class' => 'header']
                    ],
                    [
                        'label' => Yii::t('backend', 'Contacts'),
                        'url' => '#',
                        'icon' => '<i class="fa fa-address-card-o"></i>',
                        'options' => ['class' => 'treeview active'],
                        'items' => [
                            ['label' => Yii::t('backend', 'System Users'), 'url' => ['/user/index'], 'icon' => '<i class="fa fa-angle-double-right"></i>'],
                            [
                                'label' => Yii::t('backend', 'Latest Users'),
                                'icon' => '<i class="fa fa-angle-double-right"></i>',
                                'url' => ['/timeline-event/index'],
                                'badge' => TimelineEvent::find()->today()->count(),
                                'badgeBgClass' => 'label-success',
                            ],
                            ['label' => Yii::t('backend', 'Comments'), 'url' => ['/comments/index'], 'icon' => '<i class="fa fa-angle-double-right"></i>'],
                            
                        ]
                    ],
//                    [
//                        'label' => Yii::t('backend', 'Users'),
//                        'icon' => '<i class="fa fa-users"></i>',
//                        'url' => ['/user/index'],
//                        'visible' => Yii::$app->user->can('administrator')
//                    ],
                    [
                        'label' => Yii::t('backend', 'Communications'),
                        'url' => '#',
                        'icon' => '<i class="fa fa-send-o"></i>',
                        'options' => ['class' => 'communications active'],
                        'items' => [
                            ['label' => Yii::t('backend', '1- Newsletter Create Email'), 'url' => ['/newsletter/main/mailcreate'], 'icon' => '<i class="fa fa-angle-double-right"></i>'],
                            ['label' => Yii::t('backend', '2- Send Mails in Queue'), 'url' => ['/newsletter/main/sending'], 'icon' => '<i class="fa fa-angle-double-right"></i>'],
                            ['label' => Yii::t('backend', 'Send Simple Email'), 'url' => ['/communication/send-email'], 'icon' => '<i class="fa fa-angle-double-right"></i>'],
                            ['label' => Yii::t('backend', 'Newsletter Group'), 'url' => ['/newsletter/group/index'], 'icon' => '<i class="fa fa-angle-double-right"></i>'],
                            ['label' => Yii::t('backend', 'Newsletter Merge Fields'), 'url' => ['/newsletter/mergefields'], 'icon' => '<i class="fa fa-angle-double-right"></i>'],
                            ['label' => Yii::t('backend', 'Newsletter Email Templates'), 'url' => ['/newsletter/email-templates'], 'icon' => '<i class="fa fa-angle-double-right"></i>'],
                            ['label' => Yii::t('backend', 'Newsletter Settings'), 'url' => ['/newsletter/setting/index'], 'icon' => '<i class="fa fa-angle-double-right"></i>'],
                        ]
                    ],                    [
                        'label' => Yii::t('backend', 'Statistics'),
                        'url' => '#',
                        'icon' => '<i class="fa fa-bar-chart-o"></i>',
                        'options' => ['class' => 'reports active'],
                        'items' => [
                            ['label' => Yii::t('backend', 'Viewed Books'), 'url' => ['/report/index'], 'icon' => '<i class="fa fa-angle-double-right"></i>'],
                        ]
                    ],
                    [
                        'label' => Yii::t('backend', 'System Content'),
                        'url' => '#',
                        'icon' => '<i class="fa fa-list"></i>',
                        'options' => ['class' => 'treeview active'],
                        'items' => [
                            ['label' => Yii::t('backend', 'Text Widgets'), 'url' => ['/widget-text/index'], 'icon' => '<i class="fa fa-angle-double-right"></i>'],
                            ['label' => Yii::t('backend', 'Static pages'), 'url' => ['/page/index'], 'icon' => '<i class="fa fa-angle-double-right"></i>'],
                            ['label' => Yii::t('backend', 'Menu Widgets'), 'url' => ['/widget-menu/index'], 'icon' => '<i class="fa fa-angle-double-right"></i>'],
                            ['label' => Yii::t('backend', 'Carousel Widgets'), 'url' => ['/widget-carousel/index'], 'icon' => '<i class="fa fa-angle-double-right"></i>'],
                        ]
                    ],
                    [
                        'label' => Yii::t('backend', 'System'),
                        'options' => ['class' => 'header']
                    ],
                    [
                        'label' => Yii::t('backend', 'Other'),
                        'url' => '#',
                        'icon' => '<i class="fa fa-cogs"></i>',
                        'options' => ['class' => 'treeview'],
                        'items' => [
                            [
                                'label' => Yii::t('backend', 'i18n'),
                                'url' => '#',
                                'icon' => '<i class="fa fa-flag"></i>',
                                'options' => ['class' => 'treeview'],
                                'items' => [
                                    ['label' => Yii::t('backend', 'i18n Source Message'), 'url' => ['/i18n/i18n-source-message/index'], 'icon' => '<i class="fa fa-angle-double-right"></i>'],
                                    ['label' => Yii::t('backend', 'i18n Message'), 'url' => ['/i18n/i18n-message/index'], 'icon' => '<i class="fa fa-angle-double-right"></i>'],
                                ]
                            ],
                            ['label' => Yii::t('backend', 'Key-Value Storage'), 'url' => ['/key-storage/index'], 'icon' => '<i class="fa fa-angle-double-right"></i>'],
                            ['label' => Yii::t('backend', 'File Storage'), 'url' => ['/file-storage/index'], 'icon' => '<i class="fa fa-angle-double-right"></i>'],
                            ['label' => Yii::t('backend', 'Cache'), 'url' => ['/cache/index'], 'icon' => '<i class="fa fa-angle-double-right"></i>'],
                            ['label' => Yii::t('backend', 'File Manager'), 'url' => ['/file-manager/index'], 'icon' => '<i class="fa fa-angle-double-right"></i>'],
                            [
                                'label' => Yii::t('backend', 'System Information'),
                                'url' => ['/system-information/index'],
                                'icon' => '<i class="fa fa-angle-double-right"></i>'
                            ],
                            [
                                'label' => Yii::t('backend', 'Logs'),
                                'url' => ['/log/index'],
                                'icon' => '<i class="fa fa-angle-double-right"></i>',
                                'badge' => \backend\models\SystemLog::find()->count(),
                                'badgeBgClass' => 'label-danger',
                            ],
                        ]
                    ]
                ]
            ])
            ?>
        </section>
        <!-- /.sidebar -->
    </aside>

    <!-- Right side column. Contains the navbar and content of the page -->
    <aside class="content-wrapper">
        <!-- Content Header (Page header) -->
        <section class="content-header">
            <?php
            echo Breadcrumbs::widget([
                'tag' => 'ol',
                'links' => isset($this->params['breadcrumbs']) ? $this->params['breadcrumbs'] : [],
            ])
            ?>
        </section>

        <!-- Main content -->
        <section class="content">
            <div id="flash-message">
            <?php
            //Get all flash messages and loop through them
            foreach (Yii::$app->session->getAllFlashes() as $message):;
                echo \kartik\widgets\Growl::widget([
                    'type' => (!empty($message['type'])) ? $message['type'] : 'info',
                    'title' => (!empty($message['title'])) ? Html::encode($message['title']) : 'Some info...',
                    'icon' => (!empty($message['icon'])) ? $message['icon'] : 'fa fa-info',
                    'body' => (!empty($message['message'])) ? Html::encode($message['message']) : $message,
                    'showSeparator' => true,
                    'delay' => 1, //This delay is how long before the message shows
                    'pluginOptions' => [
                        'delay' => (!empty($message['duration'])) ? $message['duration'] : 3000, //This delay is how long the message shows for
                        'placement' => [
                            'from' => (!empty($message['positonY'])) ? $message['positonY'] : 'top',
                            'align' => (!empty($message['positonX'])) ? $message['positonX'] : 'center',
                        ]
                    ]
                ]);
            endforeach;
            ?>
            </div>

<?php echo $content ?>
        </section><!-- /.content -->
    </aside><!-- /.right-side -->
</div><!-- ./wrapper -->

<?php $this->endContent(); ?>