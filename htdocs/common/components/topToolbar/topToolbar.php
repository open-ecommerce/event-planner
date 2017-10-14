<?php
/**
 * @link http://www.open-ecommerce.org/
 */

namespace common\components\topToolbar;

use Yii;
use yii\base\Widget;
use yii\base\InvalidConfigException;
use yii\helpers\ArrayHelper;
use yii\helpers\Html;

class topToolbar extends Widget
{
    /**
     * @var string the name of the breadcrumb container tag.
     */
    public $tag = 'ul';
    /**
     * @var array the HTML attributes for the breadcrumb container tag.
     * @see \yii\helpers\Html::renderTagAttributes() for details on how attributes are being rendered.
     */
    public $options = ['class' => 'top-toolbar'];
    /**
     * @var bool whether to HTML-encode the link labels.
     */
    /**
     * @var array the first hyperlink in the breadcrumbs (called home link).
     * Please refer to [[links]] on the format of the link.
     * If this property is not set, it will default to a link pointing to [[\yii\web\Application::homeUrl]]
     * with the label 'Home'. If this property is false, the home link will not be rendered.
     */
    public $links = [];


    /**
     * Renders the widget.
     */
    public function run()
    {
        if (empty($this->links)) {
            return;
        }
        $links = [];

        foreach ($this->links as $link) {
            
            $links[] = '<li>' . Html::a($link['label'], $link['url'], 
                    ['class' => $link['class'], 
                     'id' => $link['id'], 
                     'alt' => $link['alt'], 
                     'title' => $link['alt'],
                     'target' => $link['target']
                    ]) . '</li>';
            
        }
        echo Html::tag($this->tag, implode('', $links), $this->options);
        
    }


}
