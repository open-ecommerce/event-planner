<?php

use yii\helpers\BaseStringHelper;

$mobileBook = '<div class="short">' . BaseStringHelper::truncateWords($model->book->carouselDescription, 30, null, true) . '<a href="/book/' . $model->book->slug . '">read more</a></div>';
echo $mobileBook;
