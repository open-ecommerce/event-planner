<?php

use evgeniyrru\yii2slick\Slick;
use yii\helpers\BaseStringHelper;

?>

<div class="row">            
    <div class="report-carrusel <?= $carouselType ?>">
        <div class="col-sm-3 col-md-2">
            <div class="latest-line"></div>
            <div class="identity">
                <h2 class="title"><?= ucwords($carouselType) ?></h2>
            </div>
        </div>
        <div class="col-sm-9 col-md-10">
            <?php
            $items = [];
            foreach ($model as $i => $book) {
                $hotBook = '';
                $editBook = '';
                $catTip = !empty($book->otherCategories) ? 'class="category tool-tip-me" data-caption="' . $book->otherCategories . '"' : 'class="category"';
                $titleTip = (mb_strlen($book->title, 'UTF-8') > 25) ? 'class="title tool-tip-me" data-caption="' . $book->title . '"' : 'class="title';
                if (Yii::$app->user->can("administrator")) {
                    $bookUrl = Yii::$app->urlManager->createUrl(array('/admin/book/update?id=' . $book->id));
                    $editBook .= '<a class="pencil-link" title="Edit in backend" target="_blank" href="' . $bookUrl . '"><i class="glyphicon glyphicon-pencil"></i></a>';
                }
                $hotBook .= '<div ' . $catTip . '>';
                $hotBook .= '<span>' . (!empty($book->category->name) ? $book->category->name : false) . '</span>';
                $hotBook .= $editBook;
                $hotBook .= '<a class="plus-link" href="/book/' . $book->slug . '" title="View book"><i class="glyphicon glyphicon-plus-sign"></i></a>';
                $hotBook .= '</div>';
                $hotBook .= '<div ' . $titleTip . '"><a href="/book/' . $book->slug . '">' . $book->title . '</a></div>';
                $hotBook .= '<div class="author">by ' . $book->author->name . '</div>';
                $hotBook .= '<div class="short">' . BaseStringHelper::truncateWords($book->carouselDescription, 30, null, true) . '</div>';

                $items[$i] = $hotBook;
            }
            ?>
            <?php
            if (!empty($items)) {
                echo Slick::widget([
                    // HTML tag for container. Div is default.
                    'itemContainer' => 'div',
                    // HTML attributes for widget container
                    'containerOptions' => [
                        'class' => 'slide',
                    ],
                    // Items for carousel. Empty array not allowed, exception will be throw, if empty
                    'items' => $items,
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
                                    'slidesToShow' => 3,
                                    'slidesToScroll' => 3,
                                    'infinite' => true,
                                    'autoplay' => false,
                                    'dots' => false,
                                ],
                            ],
                            [
                                'breakpoint' => 992,
                                'settings' => [
                                    'slidesToShow' => 3,
                                    'slidesToScroll' => 3,
                                    'infinite' => true,
                                    'autoplay' => false,
                                    'dots' => false,
                                ],
                            ],
                            [
                                'breakpoint' => 768,
                                'settings' => [
                                    'slidesToShow' => 1,
                                    'slidesToScroll' => 1,
                                    'infinite' => true,
                                    'autoplay' => false,
                                    'dots' => false,
                                ],
                            ],
                        ],
                    ],]);
            }
            ?>

        </div>
    </div>
</div>
