<?php

namespace common\models;

use Yii;
use \common\models\base\Country as BaseCountry;
use yii\helpers\ArrayHelper;
use common\models\query\CountryQuery;

/**
 * This is the model class for table "country".
 */
class Country extends BaseCountry
{

public function behaviors()
    {
        return ArrayHelper::merge(
            parent::behaviors(),
            [
                # custom behaviors
            ]
        );
    }

    public function rules()
    {
        return ArrayHelper::merge(
             parent::rules(),
             [
                  # custom validation rules
             ]
        );
    }
    
    public static function find()
    {
        return new CountryQuery(get_called_class());
    }    


    /**
     * @param string $name
     * @return Tag[]
     */
    public static function findAllByName($name)
    {
        return Country::find()
            ->where(['like', 'country_name', $name])->limit(50)->all();
    }    
    
    
    
}
