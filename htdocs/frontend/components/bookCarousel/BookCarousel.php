<?php

namespace app\components\bookCarousel;

use yii\base\Widget;
use yii\helpers\Html;

class BookCarousel extends Widget {

    public $carouselType = 'default';
    public $model = [];

    public function init() {
        
    }

    public function run() {
        if ($this->carouselType === "news") {
            return $this->render('news', ['model' => $this->model, 'carouselType' => $this->carouselType]);
        } else {
            return $this->render('carousel', ['model' => $this->model, 'carouselType' => $this->carouselType]);
        }
    }

}

?>