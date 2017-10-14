<?php

use yii\db\Schema;
use yii\db\Migration;

class m170302_210723_contact_type extends Migration
{

    public function init()
    {
        $this->db = 'db';
        parent::init();
    }

    public function safeUp()
    {
        $tableOptions = 'ENGINE=InnoDB';

        $this->createTable(
            '{{%contact_type}}',
            [
                'id'=> $this->primaryKey(11),
                'type'=> $this->string(50)->notNull()->defaultValue('0'),
            ],$tableOptions
        );
    }

    public function safeDown()
    {
        $this->dropTable('{{%contact_type}}');
    }
}
