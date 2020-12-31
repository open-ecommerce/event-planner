<?php

namespace common\models;

/**
 * This is the ActiveQuery class for [[TicketType]].
 *
 * @see TicketType
 */
class TicketTypeQuery extends \yii\db\ActiveQuery
{
    /*public function active()
    {
        $this->andWhere('[[status]]=1');
        return $this;
    }*/

    /**
     * @inheritdoc
     * @return TicketType[]|array
     */
    public function all($db = null)
    {
        return parent::all($db);
    }

    /**
     * @inheritdoc
     * @return TicketType|array|null
     */
    public function one($db = null)
    {
        return parent::one($db);
    }
}
