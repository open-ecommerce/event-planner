<?php
/* @var $this yii\web\View */
$this->title = Yii::$app->name;

use evgeniyrru\yii2slick\Slick;
use yii\web\JsExpression;
use yii\helpers\Html;
use common\helpers\OeHelpers;
?>
<div class="container" id="book-detail">

    <div class="row" id="wrap-book">
        <div class="col-lg-9">
            <div id="main" class="row">
                <div class="col-lg-3">
                    <div class="cover">
                        <img src="/dist/img/demo/home-latest-rights-cover.jpg">
                    </div>
                </div>
                <div class="col-lg-9">
                    <div class="category">Fiction</div>
                    <div class="title">The state of Grace</div>
                    <div class="author">Renne Knight</div>
                    <div id="owner">
                        <div class="devider"></div>
                        <div class="publisher"><span class="header">Publishing House</span><br><span class="content">Editorial Planeta</span></div>
                        <div class="rights"><span class="header">Rights Owner</span><br><span class="content">Maria Calas</span></div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div id="timeline">timeline</div>
                <div id="report">
                    <div class="title">Report by Rebecca Servadio</div>
                    <div class="content">
                        <?= OeHelpers::ipsum(5); ?>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-lg-3 no-margins-padding">
            <div id="author">
                <div id="photo"><img class="img-circle" src="/dist/img/demo/renne-knight.jpg"></div>
                <div id="name">Renne Knight</div>
                <div id="about">
                    <?= OeHelpers::ipsum(1); ?>
                    Other Books<br>by Renne Knight:
                </div>
            </div>
        </div>
    </div>

    <div class="row" id="wrap-downloads">
        <div class="col-lg-2">
            <div class="identity">
                <h2 class="title">Downloads</h2>
            </div>
        </div>
        <div class="col-lg-10">
            <ul>
                <li>
                    <a href="#" data-placement="top" title="" data-original-title="Pdf">
                        <span class="fa-stack fa-lg">
                            <i class="fa fa-circle fa-stack-2x"></i>
                            <i class="fa fa-camera fa-stack-1x fa-inverse"></i>
                        </span>
                    </a>
                </li>
                <li>
                    <a href="#" data-placement="top" title="" data-original-title="Pdf">
                        <span class="fa-stack fa-lg">
                            <i class="fa fa-circle fa-stack-2x"></i>
                            <i class="fa fa-film fa-stack-1x fa-inverse"></i>
                        </span>
                    </a>
                </li>
                <li>
                    <a href="#" data-placement="top" title="" data-original-title="Pdf">
                        <span class="fa-stack fa-lg">
                            <i class="fa fa-circle fa-stack-2x"></i>
                            <i class="fa fa-file-pdf-o fa-stack-1x fa-inverse"></i>
                        </span>
                    </a>
                </li>
                <li>
                    <a href="#" data-placement="top" title="" data-original-title="Pdf">
                        <span class="fa-stack fa-lg">
                            <i class="fa fa-circle fa-stack-2x"></i>
                            <i class="fa fa-file-word-o fa-stack-1x fa-inverse"></i>
                        </span>
                    </a>
                </li>
                <li>
                    <a href="#" data-placement="top" title="" data-original-title="Pdf">
                        <span class="fa-stack fa-lg">
                            <i class="fa fa-circle fa-stack-2x"></i>
                            <i class="fa fa-file-sound-o fa-stack-1x fa-inverse"></i>
                        </span>
                    </a>
                </li>
                <li>
                    <a href="#" data-placement="top" title="" data-original-title="Pdf">
                        <span class="fa-stack fa-lg">
                            <i class="fa fa-circle fa-stack-2x"></i>
                            <i class="fa fa-file-zip-o fa-stack-1x fa-inverse"></i>
                        </span>
                    </a>
                </li>
            </ul>
        </div>
    </div>

    <div class="row" id="wrap-rights">
        <div class="col-lg-2">
            <div class="identity">
                <h2 class="title">Latest Rights</h2>
            </div>
        </div>
        <div class="col-lg-10">
            <div class="image">
                <img src="/dist/img/demo/home-latest-rights-cover.jpg">
            </div>
            <div class="details">
                <div class="title">Title book</div>
                <div class="author">Juana Arco</div>
                <div class="publisher">Publishing house: Laurel Editores<br>Rights holder: Casanovas<br>Agencia Literaria</div>
            </div>
            <div class="sold-title">Already Sold</div>
            <div class="sold">
                <div class="rights"><span class="country">Italian</span><span class="name"> (Neri Pozz)</span></div>
                <div class="rights"><span class="country">Italian</span><span class="name"> (Neri Pozz)</span></div>
                <div class="rights"><span class="country">Italian</span><span class="name"> (Neri Pozz)</span></div>
                <div class="rights"><span class="country">Italian</span><span class="name"> (Neri Pozz)</span></div>
                <div class="rights"><span class="country">Italian</span><span class="name"> (Neri Pozz)</span></div>
                <div class="rights"><span class="country">Italian</span><span class="name"> (Neri Pozz)</span></div>
                <div class="rights"><span class="country">Italian</span><span class="name"> (Neri Pozz)</span></div>
                <div class="rights"><span class="country">Italian</span><span class="name"> (Neri Pozz)</span></div>
                <div class="rights"><span class="country">Italian</span><span class="name"> (Neri Pozz)</span></div>
                <div class="rights"><span class="country">Italian</span><span class="name"> (Neri Pozz)</span></div>
                <div class="rights"><span class="country">Italian</span><span class="name"> (Neri Pozz)</span></div>
                <div class="rights"><span class="country">Italian</span><span class="name"> (Neri Pozz)</span></div>
                <div class="rights"><span class="country">Italian</span><span class="name"> (Neri Pozz)</span></div>
                <div class="rights"><span class="country">Italian</span><span class="name"> (Neri Pozz)</span></div>
                <div class="rights"><span class="country">Italian</span><span class="name"> (Neri Pozz)</span></div>
                <div class="rights"><span class="country">Italian</span><span class="name"> (Neri Pozz)</span></div>
                <div class="rights"><span class="country">Italian</span><span class="name"> (Neri Pozz)</span></div>
                <div class="rights"><span class="country">Italian</span><span class="name"> (Neri Pozz)</span></div>
            </div>
        </div>
    </div>


    <div class="row report-carrusel book-detail">
        <h2 class="title">Latest book reports</h2>
        <div class="col-lg-12">
<?=
Slick::widget([
    // HTML tag for container. Div is default.
    'itemContainer' => 'div',
    // HTML attributes for widget container
    'containerOptions' => [
        'class' => 'slide',
    ],
    // Items for carousel. Empty array not allowed, exception will be throw, if empty
    'items' => [
        '<div class="category">
                                <span>Fiction</span>
                                <a class="plus-link" href="#"><i class="glyphicon glyphicon-plus-sign"></i></a>
                            </div>
                            <div class="title">The state of Grace</div>
                            <div class="author">by Rebecca Servadio</div>
                            <div class="short">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tempus tellus ante, non consectetur orci sollicitudin vel.</div>',
        '<div class="category">
                                <span>Fiction</span>
                                <a class="plus-link" href="#"><i class="glyphicon glyphicon-plus-sign"></i></a>
                            </div>
                            <div class="title">The state of Grace</div>
                            <div class="author">by Rebecca Servadio</div>
                            <div class="short">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tempus tellus ante, non consectetur orci sollicitudin vel.</div>',
        '<div class="category">
                                <span>Fiction</span>
                                <a class="plus-link" href="#"><i class="glyphicon glyphicon-plus-sign"></i></a>
                            </div>
                            <div class="title">The state of Grace</div>
                            <div class="author">by Rebecca Servadio</div>
                            <div class="short">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tempus tellus ante, non consectetur orci sollicitudin vel.</div>',
        '<div class="category">
                                <span>Fiction</span>
                                <a class="plus-link" href="#"><i class="glyphicon glyphicon-plus-sign"></i></a>
                            </div>
                            <div class="title">The state of Grace</div>
                            <div class="author">by Rebecca Servadio</div>
                            <div class="short">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tempus tellus ante, non consectetur orci sollicitudin vel.</div>',
        '<div class="category">
                                <span>Fiction</span>
                                <a class="plus-link" href="#"><i class="glyphicon glyphicon-plus-sign"></i></a>
                            </div>
                            <div class="title">The state of Grace</div>
                            <div class="author">by Rebecca Servadio</div>
                            <div class="short">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tempus tellus ante, non consectetur orci sollicitudin vel.</div>',
    ],
    // HTML attribute for every carousel item
    'itemOptions' => ['class' => 'single-slide'],
    // settings for js plugin
    // @see http://kenwheeler.github.io/slick/#settings
    'clientOptions' => [
        'dots' => true,
        'speed' => 300,
        'autoplay' => false,
        'infinite' => false,
        'slidesToShow' => 4,
        'slidesToScroll' => 4,
        'responsive' => [
            [
                'breakpoint' => 1200,
                'settings' => [
                    'slidesToShow' => 4,
                    'slidesToScroll' => 4,
                    'infinite' => true,
                    'autoplay' => false,
                    'dots' => true,
                ],
            ],
            [
                'breakpoint' => 992,
                'settings' => [
                    'slidesToShow' => 3,
                    'slidesToScroll' => 3,
                    'infinite' => true,
                    'autoplay' => false,
                    'dots' => true,
                ],
            ],
            [
                'breakpoint' => 768,
                'settings' => [
                    'slidesToShow' => 1,
                    'slidesToScroll' => 1,
                    'infinite' => true,
                    'autoplay' => false,
                    'dots' => true,
                ],
            ],
            [
                'breakpoint' => 480,
                'settings' => 'unslick', // Destroy carousel, if screen width less than 480px
            ],
        ],
    ],]);
?>

        </div>
    </div>

    <div class="row" id="wrap-comments">
        <div id="book-comments">
            <div id="comments-title">member comments about this book</div>
            <div id="members-comments">
            </div>
        </div>
    </div>



</div>
