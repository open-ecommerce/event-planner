<?php
use yii\helpers\Html;
use evgeniyrru\yii2slick\Slick;
use yii\helpers\BaseStringHelper;
?>

    <div class="row report-carrusel <?= $carouselType ?>">
        <div class="col-sm-3 col-md-2">
            <div class="latest-line"></div>
            <div class="identity">
                <h2 class="title"><?= Html::a('Shouts and Murmurs', ['article/index'], ['class' => 'news-title-link']) ?></h2>
            </div>
        </div>
        <div class="col-sm-9 col-md-10">
            <?php
            $items = [];
            foreach ($model as $i => $article) {
                $editPost = '';
                $post = '';
                $articleUrl = "/article/" . $article->slug;
                $thumbnail = '';
                if (Yii::$app->user->can("administrator")) {
                    $urlPost = Yii::$app->urlManager->createUrl(array('/admin/article/update?id=' . $article->id));
                    $editPost .= '<a class="pencil-link" title="Edit in backend" target="_blank" href="' . $urlPost . '"><i class="glyphicon glyphicon-pencil"></i></a>';
                }
                $newsImagePath = (empty($article->thumbnail_path) ? $article->category->thumbnail_path : $article->thumbnail_path);
                if ($newsImagePath) {
                    $thumbnail .= '<figure>';
                    $thumbnail .= Html::a(\yii\helpers\Html::img(
                                            Yii::$app->glide->createSignedUrl([
                                                'glide/index',
                                                'path' => $newsImagePath,
                                                'w' => '100%'
                                                    ], true), ['class' => 'article-image']
                                    ), $articleUrl);
                    $thumbnail .= '</figure>';
                };

                $post .= '<div class="image">';
                $post .= $thumbnail;
                $post .= '</div>';
                $post .= '<div class="category">';
                $post .= '<span>' . strip_tags($article->category->title) . '</span>';
                $post .= $editPost;
                $post .= '<a class="plus-link" href="' . $articleUrl . '"><i class="glyphicon glyphicon-plus-sign"></i></a>';
                $post .= '</div>';
                $post .= '<div class="title-news">' . Html::a($article->title, $articleUrl) . '</div>';
                $post .= '<div class="author">by ' . $article->author->fullname . '</div>';
                $post .= '<div class="body-news">' . BaseStringHelper::truncateWords(strip_tags($article->body), 30) . '</div>';
                $items[$i] = $post;
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
